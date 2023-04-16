import { type GetServerSidePropsContext, type NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { type FC, useEffect, useState } from "react";

import VariantImage from "~/components/base/image/variant-image";
import LoadingArea from "~/components/base/loading";
import { type ServerSideProps } from "~/types/server";
import { api } from "~/utils/queryApi";
import { createApi } from "~/utils/serverApi";

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const queryYear = parseInt(String(context.query.year), 10);
  const helpers = await createApi(context);
  const year = Number.isInteger(queryYear)
    ? Number(queryYear)
    : new Date().getFullYear();
  await helpers.events.getEventsForYear.prefetch({
    year,
  });
  await helpers.events.getYearsWithEvents.prefetch();

  return {
    props: {
      trpcState: helpers.dehydrate(),
      year,
    },
  };
};

type Props = ServerSideProps<typeof getServerSideProps>;

const MonthYearFormatter = new Intl.DateTimeFormat("hr-HR", {
  month: "long",
  year: "numeric",
});

const EventDateFormatter = new Intl.DateTimeFormat("hr-HR", {
  day: "numeric",
  month: "numeric",
  year: "numeric",
});

const EventList: FC<{
  year: number;
}> = ({ year }) => {
  const [data] = api.events.getEventsForYear.useSuspenseQuery(
    {
      year,
    },
    {
      staleTime: 5 * 60 * 1000,
    },
  );

  const entriesByMonth = Object.entries(data.groupedByMonth).sort(
    ([lt], [gt]) => Number(gt) - Number(lt),
  );

  return (
    <>
      <NextSeo title={`Program ${data.forYear}`} />
      <div className="flex flex-col gap-10 overflow-hidden br:gap-4">
        {entriesByMonth.map(([month, events]) => (
          <div
            key={month}
            className="group/container grid grid-cols-1 gap-4 br:grid-cols-[12ch_1fr] br:gap-10"
          >
            <h2 className="w-min text-2xl font-extrabold capitalize leading-8 tracking-wider opacity-[0.25]">
              {MonthYearFormatter.format(new Date(data.forYear, Number(month)))}
            </h2>

            <div className="border-white/2 flex flex-col gap-8 divide-y border-white/25 group-first/container:-mt-4 group-first/container:border-t-0 max-br:-mt-4 br:gap-4 br:border-t [&>*]:border-inherit [&>*]:pt-8 br:[&>*]:pt-4">
              {events.map((event) => {
                return (
                  <Link
                    key={event.id}
                    className="group/link scroll-mt-16 text-white no-underline"
                    id={`event_${event.slug!}`}
                    href={{
                      pathname: "/program/[slug]",
                      query: {
                        slug: event.slug,
                      },
                    }}
                  >
                    <div className="grid grid-cols-1 gap-2 br:grid-cols-[theme(spacing.56)_auto] br:gap-10">
                      <VariantImage
                        alt={event.title}
                        aspectRatio={3 / 2}
                        src={event.thumb}
                      />
                      <div className="flex flex-col tracking-[1.6px] br:py-6">
                        <time
                          className="leading-5 opacity-60"
                          dateTime={event.date.toISOString()}
                        >
                          {EventDateFormatter.format(event.date)}
                        </time>
                        <h3 className="mb-4 text-2xl font-bold leading-8 group-hover/link:underline br:line-clamp-2">
                          {event.title}
                        </h3>
                        <div className="mt-auto flex gap-4 divide-x text-xs leading-4 [&>*]:border-primary [&>*]:pl-4">
                          {event.tags.length > 0 ? (
                            <span className="first:pl-0">
                              {event.tags.join(", ")}
                            </span>
                          ) : null}
                          {event.price ? (
                            <span className="first:pl-0">{event.price}</span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

const PageProgramHome: NextPage<Props> = ({ year }) => {
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState(
    year ?? new Date().getFullYear(),
  );

  const [eventYears] = api.events.getYearsWithEvents.useSuspenseQuery();

  useEffect(() => {
    if (router.query.year === String(selectedYear)) {
      return;
    }

    void router.replace(
      {
        query: {
          ...router.query,
          year: selectedYear,
        },
      },
      undefined,
      {
        shallow: true,
        scroll: false,
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear]);

  return (
    <>
      <div className="flex w-full items-center bg-[#28282D] p-4 pb-7">
        <select
          className="bg-black text-white"
          defaultValue={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          <option disabled>Odaberi interval</option>
          {eventYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div className="h-20" role="none" />
      <LoadingArea position="top right">
        <EventList year={selectedYear} />
      </LoadingArea>
    </>
  );
};

export default PageProgramHome;
