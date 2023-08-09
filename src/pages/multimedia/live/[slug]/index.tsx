import { type GetServerSidePropsContext, type NextPage } from "next";

import VariantImage from "~/components/base/image/variant-image";
import { type ServerSideProps } from "~/types/server";
import { api } from "~/utils/queryApi";
import { createApi } from "~/utils/serverApi";

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const helpers = await createApi(context);
  const slug = context.params?.slug;

  if (!slug || Array.isArray(slug)) {
    return {
      props: {
        notFound: true,
        trpcState: helpers.dehydrate(),
        slug: "",
      },
    };
  }

  await helpers.gallery.getGallery.prefetch({
    slug,
  });

  return {
    props: {
      notFound: false,
      trpcState: helpers.dehydrate(),
      slug,
    },
  };
};

type Props = ServerSideProps<typeof getServerSideProps>;

const PageGallery: NextPage<Props> = ({ slug }) => {
  if (!slug) {
    return null;
  }

  const [gallery] = api.gallery.getGallery.useSuspenseQuery({
    slug,
  });

  if (!gallery) {
    return null;
  }

  return (
    <>
      <div>
        <h1 className="text-6xl font-bold tracking-wide">{gallery.title}</h1>
        <h2 className="mt-8 text-xl">
          <p>
            <time dateTime={gallery.dateOfEvent.toISOString()}>
              {gallery.dateOfEvent.toLocaleDateString("hr-HR")}
            </time>
          </p>
          <p className="font-bold">
            Copyright by:{" "}
            <a className="no-underline" href={gallery.photographer?.url ?? "#"}>
              {gallery.photographer?.name}
            </a>
          </p>
          <div
            dangerouslySetInnerHTML={{
              __html: gallery.description,
            }}
          />
        </h2>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 br:grid-cols-3">
        {gallery.galleryImageAlbum.map((image) => {
          return (
            <div key={image.id}>
              <VariantImage
                alt={image.image.caption ?? image.image.title}
                aspectRatio={3 / 2}
                src={image.image.uploadPath}
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default PageGallery;
