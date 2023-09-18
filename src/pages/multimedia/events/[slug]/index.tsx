import { type GetServerSidePropsContext, type NextPage } from "next";
import Link from "next/link";

import VariantImage from "~/components/base/image/variant-image";
import { type ServerSideProps } from "~/types/server";
import { src } from "~/utils/kset-image";
import { api } from "~/utils/queryApi";
import { createApi } from "~/utils/serverApi";

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const helpers = await createApi(context);
  const slug = context.params?.slug;

  if (!slug || Array.isArray(slug)) {
    return {
      notFound: true,
      props: {
        slug: "",
      },
    };
  }

  const item = await helpers.gallery.getGallery.fetch({
    slug,
  });

  if (!item) {
    return {
      notFound: true,
      props: {
        slug,
      },
    };
  }

  return {
    props: {
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
      <Link
        href={{
          pathname: "/multimedia/events",
          query: {
            year: gallery.dateOfEvent.getFullYear(),
          },
          hash: `#item__${gallery.slug}`,
        }}
      >
        &larr; Natrag
      </Link>
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
        {gallery.galleryImageAlbum.map((item) => {
          return (
            <div key={item.id}>
              <a
                href={src(item.image.uploadPath)}
                rel="noreferrer"
                target="_blank"
              >
                <VariantImage
                  alt={item.image.caption ?? item.image.title}
                  aspectRatio={3 / 2}
                  src={item.image.uploadPath}
                />
              </a>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default PageGallery;
