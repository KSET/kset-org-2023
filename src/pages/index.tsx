import { type NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { type FC, type HTMLProps, type ReactNode, useMemo } from "react";

import ImageHero from "~/assets/page/index/hero.png";
import AppImage from "~/components/base/image/app-image";
import VariantImage from "~/components/base/image/variant-image";
import { LinkWithArrow } from "~/components/base/link/LinkWithIcon";
import { GalleryCard } from "~/components/gallery/GalleryCard";
import { type TrpcResultEntry } from "~/types/trpc";
import { cn } from "~/utils/class";
import { api } from "~/utils/queryApi";
import { trimHtmlToTextOfLength } from "~/utils/string";

type TEventItem = TrpcResultEntry<"events.getUpcomingEvents">;
type TNewsItem = TrpcResultEntry<"news.getNews">;

const EventItem: FC<HTMLProps<HTMLDivElement> & { item: TEventItem }> = ({
  item,
  ...props
}) => {
  return (
    <article
      {...props}
      className={cn("flex flex-col border-inherit px-6", props.className)}
    >
      <time className="text-xs text-primary" dateTime={item.date.toISOString()}>
        {item.date.toLocaleDateString("hr-HR", {
          weekday: "long",
          year: "numeric",
          month: "numeric",
          day: "numeric",
        })}
      </time>
      <h3 className="mb-3">
        <Link
          key={item.id}
          className="inline-block text-white no-underline hover:underline"
          href={{
            pathname: "/program/[slug]",
            query: { slug: item.slug },
          }}
        >
          {item.title}
        </Link>
      </h3>
      <div className="mt-auto text-xs">
        {item.tags.length > 0 ? (
          <>
            <span>{item.tags.join(", ")}</span>
            <div
              className="mx-4 inline border-l border-primary/60"
              role="none"
            />
          </>
        ) : null}
        {item.price ? <span>{item.price}</span> : null}
      </div>
    </article>
  );
};

const SectionUpcomingEvents: FC = () => {
  const [upcomingEvents] = api.events.getUpcomingEvents.useSuspenseQuery();

  if (upcomingEvents.length === 0) {
    return null;
  }

  return (
    <section className="mb-24 br:mb-56">
      <h2 className="mb-4 text-lg font-bold uppercase tracking-[0.1325em] opacity-30">
        Nadolazeći događaji
      </h2>
      <div className="grid auto-rows-[0] grid-cols-1 grid-rows-1 gap-x-[--border-width] overflow-y-hidden bg-white/20 px-[--border-width] [--border-width:1px] sm:grid-cols-2 md:grid-cols-3 br:grid-cols-5">
        {upcomingEvents.map((event) => (
          <EventItem key={event.id} className="bg-off-black" item={event} />
        ))}
      </div>
    </section>
  );
};

const NewsItem: FC<HTMLProps<HTMLDivElement> & { item: TNewsItem }> = ({
  item,
}) => {
  return (
    <Link
      className="text-white no-underline"
      href={{
        pathname: "/news/[slug]",
        query: { slug: item.slug },
      }}
    >
      <article>
        <VariantImage alt={item.subject} aspectRatio={1.15} src={item.thumb} />
        <div className="mt-5 text-sm tracking-widest">
          <span className="text-primary">Ligma</span>
          <span className="mx-3 opacity-30">&ndash;</span>
          <time dateTime={item.createdAt.toISOString()}>
            {item.createdAt.toLocaleDateString("hr-HR")}
          </time>
        </div>
        <div>
          <h3 className="text-lg font-bold leading-6 tracking-wider">
            {item.subject}
          </h3>
          <p className="mt-2 line-clamp-4 leading-5 tracking-wider opacity-70">
            {trimHtmlToTextOfLength(item.description ?? item.content, 250)}
          </p>
        </div>
      </article>
    </Link>
  );
};

const SectionNews: FC = () => {
  const [news] = api.news.getNews.useSuspenseQuery();

  return (
    <section>
      <h2
        className="flex flex-wrap items-center text-3xl font-bold uppercase"
        id="news"
      >
        <span className="tracking-[2.4px]">Vijesti</span>
        <LinkWithArrow
          className="ml-auto text-base tracking-wider"
          href={{
            pathname: "/news",
          }}
        >
          Vidi vijesti
        </LinkWithArrow>
      </h2>

      <div className="mt-9 grid grid-cols-1 gap-8 md:grid-cols-2 br:grid-cols-4">
        {news.map((news) => (
          <NewsItem key={news.id} item={news} />
        ))}
      </div>
    </section>
  );
};

const WhatWeDoCard: FC<
  HTMLProps<HTMLDivElement> & {
    title: ReactNode;
    body: ReactNode;
    image?: {
      src: string;
      alt: string;
    };
  }
> = ({ title, body, image, ...props }) => {
  return (
    <div {...props} className={cn(props.className, "tracking-wide")}>
      <div className="px-8">
        <div className="aspect-square w-full overflow-hidden rounded-full bg-stone-300">
          {image ? (
            <img
              alt={image.alt}
              className="aspect-square w-full object-cover object-center"
              src={image.src}
            />
          ) : null}
        </div>
      </div>
      <h5 className="mt-12 text-center text-lg font-bold uppercase opacity-80">
        {title}
      </h5>
      <p className="text-center opacity-80">{body}</p>
    </div>
  );
};

const SectionWhatWeDo: FC = () => {
  const items = useMemo(
    () => [
      {
        title: "Jutarnji šank",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis in laoreet lectus.",
        image: {
          src: "https://loremflickr.com/1280/720",
          alt: "Jutarnji šank",
        },
      },
      {
        title: "Večernji program",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis in laoreet lectus.",
        image: {
          src: "https://loremflickr.com/720/1280",
          alt: "Večernji program",
        },
      },
      {
        title: "Projekti",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis in laoreet lectus.",
        image: {
          src: "https://loremflickr.com/2000/2000",
          alt: "Projekti",
        },
      },
      {
        title: "Edukacija",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis in laoreet lectus.",
        image: {
          src: "https://loremflickr.com/50/50",
          alt: "Edukacija",
        },
      },
    ],
    [],
  );

  return (
    <section className="mt-28 bg-secondary p-11">
      <h2 className="text-center text-3xl font-bold tracking-wide">
        Čime se bavimo?
      </h2>

      <div className="mt-14 grid grid-cols-1 justify-between gap-8 md:grid-cols-2 br:grid-cols-4">
        {items.map((item) => (
          <WhatWeDoCard key={item.title} {...item} />
        ))}
      </div>
    </section>
  );
};

const SectionQuiz: FC = () => {
  return (
    <div className="mt-16 flex flex-col br:mx-20 br:grid br:grid-cols-[minmax(0,4fr),minmax(0,3fr)] br:gap-16">
      <div className="bg-stone-300">
        <AppImage
          alt="Pronađi svoju sekciju i postani član KSET-a!"
          mode="cover"
          src="https://loremflickr.com/1920/1080"
          aspect={{
            ratio: 555 / 442,
          }}
        />
      </div>

      <div className="mt-6 flex flex-col items-start tracking-wide br:mb-11 br:mt-14">
        <h3 className="text-3xl font-bold">
          Pronađi svoju sekciju i postani član KSET-a!
        </h3>

        <p className="mb-6 mt-4 opacity-80">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis in
          laoreet lectus. Vestibulum ante ipsum primis in faucibus orci luctus
          et ultrices posuere cubilia curae; Vivamus turpis dui, semper
          lobortis.
        </p>

        <button
          className="bg-primary px-7 py-3 font-bold tracking-wide text-secondary br:mt-auto"
          type="button"
        >
          OTKRIJ KOJA SI SEKCIJA
        </button>
      </div>
    </div>
  );
};

const SectionGallery: FC = () => {
  const [gallery] = api.gallery.getGalleries.useSuspenseQuery();

  return (
    <section className="mt-20">
      <div className="mb-9 flex items-center max-br:flex-col">
        <h2 className="text-3xl font-bold uppercase tracking-widest">
          Fotogalerija
        </h2>

        <LinkWithArrow
          className="ml-auto uppercase no-underline"
          href="/multimedia"
        >
          Vidi galeriju
        </LinkWithArrow>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 br:grid-cols-4">
        {gallery.map((item) => (
          <GalleryCard
            key={item.id}
            date={item.dateOfEvent}
            photographer={item.photographer?.name}
            slug={item.slug}
            thumb={item.thumb}
            title={item.title}
          />
        ))}
      </div>
    </section>
  );
};

const PageIndex: NextPage = () => {
  return (
    <>
      <Image
        priority
        alt="KSET tri kruga (volončelo, gitara, bubanj)"
        className="mb-8 w-full object-contain object-center"
        src={ImageHero}
      />

      <SectionUpcomingEvents />

      <SectionNews />

      <SectionWhatWeDo />

      <SectionQuiz />

      <SectionGallery />
    </>
  );
};

export default PageIndex;
