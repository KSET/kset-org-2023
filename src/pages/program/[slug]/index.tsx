import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { htmlToText } from "html-to-text";
import { type GetServerSidePropsContext } from "next";
import Link from "next/link";
import { NextSeo, type NextSeoProps } from "next-seo";
import { type FC } from "react";
import { RxArrowLeft as IconArrowLeft } from "react-icons/rx";

import { Carousel } from "~/components/base/carousel";
import VariantImage from "~/components/base/image/variant-image";
import { ProgramContents } from "~/components/program/program-contents";
import { SeparatedItems } from "~/components/util/separated-items";
import { MainLayout } from "~/layouts/main";
import { type NextPageWithLayout } from "~/types/layout";
import { type ServerSideProps } from "~/types/server";
import { type TrpcResult } from "~/types/trpc";
import { src } from "~/utils/kset-image";
import { api } from "~/utils/queryApi";
import { createApi } from "~/utils/serverApi";

type ClubEvent = TrpcResult<"events.getEventInfo">;

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const helpers = await createApi(context);
  const slug = context.params!.slug! as string;
  const event = await helpers.events.getEventInfo.fetch({
    slug,
    withImages: true,
  });

  return {
    notFound: !event,
    props: {
      slug,
      trpcState: helpers.dehydrate(),
    },
  };
};

type Props = ServerSideProps<typeof getServerSideProps>;

const Seo: FC<{ event: ClubEvent }> = ({ event }) => {
  const thumbSrc = src(event.thumb);

  const dayAfter = new Date(event.date);
  dayAfter.setDate(dayAfter.getDate() + 1);

  const config: NextSeoProps = {
    title: event.title,
    description: event.description
      ? htmlToText(event.description, { wordwrap: false }).replace(/\s+/gi, " ")
      : undefined,
    openGraph: {
      type: "article",
      article: {
        section: "Program",
        authors: ["KSET"],
        expirationTime: dayAfter.toISOString(),
        tags: event.tags,
      },
    },
  };

  if (event.fbEventId) {
    config.facebook = {
      ...config.facebook,
      appId: event.fbEventId,
    };
  }

  if (thumbSrc) {
    config.openGraph = {
      ...config.openGraph,
      images: [{ url: thumbSrc }],
    };
  }

  return <NextSeo {...config} />;
};

const PageProgramItem: NextPageWithLayout<Props> = ({ slug }) => {
  if (!slug) {
    return null;
  }

  const [event] = api.events.getEventInfo.useSuspenseQuery({
    slug,
    withImages: true,
  });

  if (!event) {
    return null;
  }

  const thumbSrc = src(event.thumb);

  return (
    <>
      <Seo event={event} />
      <div className="container mb-6">
        <Link
          className="flex items-center gap-1 font-bold leading-5 tracking-wider no-underline opacity-80 transition-opacity duration-300 hover:underline hover:opacity-100 hover:duration-0"
          href={{
            pathname: "/program",
            query: {
              year: event.date.getFullYear(),
            },
            hash: `#event_${event.slug!}`,
          }}
        >
          <IconArrowLeft /> Povratak
        </Link>
      </div>
      <article className="bg-white text-black">
        {thumbSrc ? (
          <div className="br:container">
            <div className="float-left w-full br:w-2/3 br:pr-10">
              <VariantImage
                alt={event.title}
                aspectRatio={3 / 2}
                src={thumbSrc}
              />
            </div>
          </div>
        ) : null}

        <div className="clear-both w-full bg-off-black py-4 text-white br:float-none br:clear-none br:mb-0 br:w-auto br:pt-0">
          <div className="container">
            <time dateTime={event.date.toISOString()}>
              {event.date.toLocaleDateString("hr-HR", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
              })}
            </time>
            <h1 className="mt-1 text-3xl font-bold tracking-wide">
              {event.title}
            </h1>
            <SeparatedItems className="mt-10 flex flex-wrap border-primary/60 tracking-widest">
              {event.tags.length > 0 ? (
                <span>{event.tags.join(", ")}</span>
              ) : null}
              {event.price ? <span>{event.price}</span> : null}
              {event.time ? (
                <span>
                  {event.time.toLocaleTimeString("hr-HR", {
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </span>
              ) : null}
              {event.fbEventId ? (
                <span>
                  <a
                    href={`https://www.facebook.com/events/${event.fbEventId}`}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Facebook
                  </a>
                </span>
              ) : null}
            </SeparatedItems>
          </div>
        </div>

        <ProgramContents
          className="container clear-both mx-auto pb-14 pt-10 max-br:clear-both br:max-w-[55vw] br:px-0 br:text-lg"
          html={(event.description ?? "") + (event.content ?? "")}
        />

        {event.gallery ? (
          <div className="bg-off-black text-white">
            <div className="container py-7">
              <h2 className="text-center text-3xl font-bold uppercase leading-8 tracking-widest">
                Fotke eventa
              </h2>
              {event.gallery.photographer ? (
                <p className="mt-2 text-center leading-none">
                  foto: <a href="#">{event.gallery.photographer.name}</a>
                </p>
              ) : null}
              <div className="mt-6">
                <div className="overflow-hidden">
                  <Carousel
                    className="max-br:[--slide-size-override:100%]"
                    displayed={3}
                  >
                    {event.gallery.galleryImageAlbum.map(({ image }) => {
                      return (
                        <Carousel.Item key={image.id}>
                          <AspectRatio ratio={1.2}>
                            <img
                              alt={image.title}
                              className="h-full w-full object-cover"
                              decoding="async"
                              loading="lazy"
                              src={src(image.uploadPath)}
                            />
                          </AspectRatio>
                        </Carousel.Item>
                      );
                    })}
                  </Carousel>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </article>
    </>
  );
};

PageProgramItem.getLayout = (page) => (
  <MainLayout className="max-w-[initial] !p-0 [&>header]:container">
    {page}
  </MainLayout>
);

export default PageProgramItem;
