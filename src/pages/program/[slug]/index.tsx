import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import Image from "next/image";
import { NextSeo } from "next-seo";

import { ProgramContents } from "~/components/program/program-contents";
import { SeparatedItems } from "~/components/util/separated-items";
import { MainLayout } from "~/layouts/main";
import { type NextPageWithLayout } from "~/types/layout";
import { createApi } from "~/utils/serverApi";

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const api = await createApi(context);
  const slug = context.params!.slug! as string;
  const event = await api.events.getEventInfo({ slug, withImages: true });

  return {
    notFound: !event,
    props: {
      event,
    },
  };
};

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const src = <
  TSrc extends string | null | undefined,
  TRet extends TSrc extends string
    ? `https://www.kset.org/media/${TSrc}`
    : null,
>(
  src: TSrc,
): TRet => {
  if (!src) {
    return null as TRet;
  }

  return `https://www.kset.org/media/${src}` as TRet;
};

const PageProgramItem: NextPageWithLayout<Props> = ({ event }) => {
  if (!event) {
    return null;
  }

  const date = new Date(event.date);
  const time = event.time ? new Date(event.time) : null;
  const thumbSrc = src(event.thumb!);

  return (
    <>
      <NextSeo
        description={event.description}
        title={event.title}
        facebook={
          event.fbeventid
            ? {
                appId: event.fbeventid,
              }
            : undefined
        }
        openGraph={
          thumbSrc
            ? {
                images: [
                  {
                    url: thumbSrc,
                  },
                ],
              }
            : undefined
        }
      />
      <article className="bg-white text-black">
        <div className="container">
          <div className="float-left w-2/3 pr-10">
            <AspectRatio
              ratio={3 / 2}
              className="bg-center object-cover"
              style={{
                backgroundImage: `url(${thumbSrc})`,
              }}
            >
              <Image
                className="object-contain backdrop-blur-lg backdrop-saturate-150"
                fill
                alt={event.title}
                src={thumbSrc}
              />
            </AspectRatio>
          </div>
        </div>

        <div className="bg-off-black pb-10 text-white">
          <div className="container">
            <time dateTime={event.date}>
              {date.toLocaleDateString("hr-HR", {
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
              {time ? (
                <span>
                  {time.toLocaleTimeString("hr-HR", {
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </span>
              ) : null}
              {event.fbeventid ? (
                <span>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://www.facebook.com/events/${event.fbeventid}`}
                  >
                    Facebook
                  </a>
                </span>
              ) : null}
            </SeparatedItems>
          </div>
        </div>

        <div aria-hidden="true" className="clear-both" />

        <ProgramContents
          className="mx-auto max-w-[55vw] pb-14 pt-10 text-lg"
          html={event.content}
        />

        {event.gallery ? (
          <div className="bg-off-black text-white">
            <div className="container py-7">
              <h2 className="text-center text-3xl font-bold uppercase leading-8 tracking-widest">
                Fotke eventa
              </h2>
              {event.gallery.gallery_photographer ? (
                <p className="mt-2 text-center leading-none">
                  foto:{" "}
                  <a href="#">{event.gallery.gallery_photographer.name}</a>
                </p>
              ) : null}
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
