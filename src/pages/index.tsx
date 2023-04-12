import { type NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { type FC } from "react";

import ImageHero from "~/assets/page/index/hero.png";
import { api, type RouterOutputs } from "~/utils/queryApi";

type TEventItem = RouterOutputs["events"]["getUpcomingEvents"][number];

const EventItem: FC<{ item: TEventItem }> = ({ item }) => {
  return (
    <article className="flex flex-col border-inherit px-6">
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
          className="inline-block text-white no-underline hover:underline"
          href={{
            pathname: "/program/[slug]",
            query: { slug: item.slug },
          }}
          key={item.id}
        >
          {item.title}
        </Link>
      </h3>
      <div className="mt-auto text-xs">
        {item.tags.length > 0 ? (
          <>
            <span>{item.tags.join(", ")}</span>
            <hr className="mx-4 inline border-l border-primary/60" />
          </>
        ) : null}
        {item.price ? (
          <>
            <span>{item.price}</span>
          </>
        ) : null}
      </div>
    </article>
  );
};

const PageIndex: NextPage = () => {
  const [upcomingEvents] = api.events.getUpcomingEvents.useSuspenseQuery();

  return (
    <>
      <Image
        className="w-full object-contain object-center"
        src={ImageHero}
        alt="KSET tri kruga (volončelo, gitara, bubanj)"
        priority
      />
      <section>
        <h2 className="mb-4 text-lg font-bold uppercase tracking-[0.1325em] opacity-30">
          Nadolazeći događaji
        </h2>
        <div className="grid auto-rows-[0] grid-cols-1 grid-rows-1 divide-x overflow-y-hidden border-x border-white/20 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {upcomingEvents.map((event) => (
            <EventItem key={event.id} item={event} />
          ))}
        </div>
      </section>
    </>
  );
};

export default PageIndex;
