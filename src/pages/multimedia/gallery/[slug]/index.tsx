import { type GetServerSidePropsContext, type NextPage } from "next";
import SuperJSON from "superjson";

import VariantImage from "~/components/base/image/variant-image";
import { type ServerSideProps } from "~/types/server";
import { type RouterOutputs } from "~/utils/api";
import { createApi } from "~/utils/serverApi";

type Gallery = NonNullable<RouterOutputs["gallery"]["getGallery"]>;

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const helpers = await createApi(context);
  const slug = context.params!.slug! as string;
  const gallery = await helpers.gallery.getGallery.fetch({
    slug,
  });

  return {
    notFound: !gallery,
    props: {
      entry: SuperJSON.serialize(gallery),
    },
  };
};

type Props = ServerSideProps<typeof getServerSideProps>;

const PageGallery: NextPage<Props> = ({ entry }) => {
  if (!entry) {
    return null;
  }
  const gallery = SuperJSON.deserialize<Gallery>(entry);

  if (!("gallery_photographer" in gallery)) {
    return null;
  }

  return (
    <>
      <div>
        <h1 className="text-6xl font-bold tracking-wide">{gallery.title}</h1>
        <h2 className="mt-8 text-xl">
          <p>
            <time dateTime={gallery.date_of_event.toISOString()}>
              {gallery.date_of_event.toLocaleDateString("hr-HR")}
            </time>
          </p>
          <p className="font-bold">
            Copyright by:{" "}
            <a
              className="no-underline"
              href={gallery.gallery_photographer?.url ?? "#"}
            >
              {gallery.gallery_photographer?.name}
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
        {gallery.gallery_image_album.map((image) => {
          return (
            <div key={image.id}>
              <VariantImage
                alt={image.gallery_image.caption ?? image.gallery_image.title}
                aspectRatio={3 / 2}
                src={image.gallery_image.upload_path}
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default PageGallery;
