import { type GetServerSidePropsContext, type NextPage } from "next";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { type FC, useEffect, useState } from "react";

import {
  UrlPersistedInput,
  UrlPersistedSelect,
} from "~/components/base/input/url-persisted";
import LoadingArea from "~/components/base/loading";
import { GalleryCard } from "~/components/gallery/GalleryCard";
import { useThrottledState } from "~/hooks/useThrottled";
import { type ServerSideProps } from "~/types/server";
import { utcDate } from "~/utils/date";
import { api } from "~/utils/queryApi";

const QUERY_KEY_FOR = {
  search: "q",
  year: "year",
};

const monthFormatter = new Intl.DateTimeFormat("hr-HR", {
  month: "long",
});

const GalleryList: FC<{
  initialSearch?: string;
  forYear: number;
}> = (props) => {
  const router = useRouter();
  const { throttledState: throttledSearch, setState: setSearch } =
    useThrottledState(props.initialSearch, 500);
  const [year, setYear] = useState(props.forYear);

  useEffect(() => {
    const routerQuery = router.query;

    {
      const qSearch = routerQuery[QUERY_KEY_FOR.search];
      if (typeof qSearch === "string") {
        setSearch(qSearch);
      } else {
        setSearch("");
      }
    }

    {
      const qYear = routerQuery[QUERY_KEY_FOR.year];
      if (typeof qYear === "string") {
        setYear(Number(qYear));
      } else {
        setYear(new Date().getFullYear());
      }
    }
  }, [router.query, setSearch]);

  const [data] = api.gallery.getGalleryOverview.useSuspenseQuery(
    {
      eventType: "live",
      forYear: year,
      filter: {
        titleOrPhotographerName: throttledSearch,
      },
    },
    {
      staleTime: 60 * 1000,
    },
  );

  return (
    <>
      {Object.entries(data.groupedByMonth).map(([month, galleries]) => {
        return (
          <div
            key={month}
            className="grid grid-cols-1 gap-4 br:grid-cols-[12ch,1fr] br:gap-8"
          >
            <h3 className="text-2xl font-extrabold capitalize tracking-wide opacity-25">
              {monthFormatter.format(
                utcDate({
                  year: props.forYear,
                  month: Number(month),
                  day: 1,
                }),
              )}
              <br />
              {data.forYear}.
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 br:grid-cols-3 br:gap-x-10 br:gap-y-16">
              {galleries.map((gallery) => {
                return (
                  <GalleryCard
                    key={gallery.id}
                    aspectRatio={7 / 5}
                    date={gallery.dateOfEvent}
                    id={`item__${gallery.slug}`}
                    photographer={gallery.photographer?.name}
                    slug={gallery.slug}
                    thumb={gallery.thumb}
                    title={gallery.title}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
};

export const getServerSideProps = (context: GetServerSidePropsContext) => {
  const queryYear = parseInt(String(context.query[QUERY_KEY_FOR.year]), 10);
  const year = Number.isInteger(queryYear)
    ? Number(queryYear)
    : new Date().getFullYear();
  const search = String(context.query[QUERY_KEY_FOR.search] ?? "");

  return {
    props: {
      year,
      search,
    },
  };
};
type Props = ServerSideProps<typeof getServerSideProps>;

const PageMultimediaEventsHome: NextPage<Props> = (props) => {
  const forYear = props.year ?? new Date().getFullYear();

  return (
    <>
      <NextSeo title={`Multimedia - Eventi ${forYear}`} />
      <div className="flex items-end justify-between gap-6 bg-secondary p-4 pb-7 text-sm max-br:flex-col [&>*]:flex-1">
        <UrlPersistedInput
          initialValue={props.search}
          label="Traži pojam"
          name="search"
          placeholder="Traži po naslovu ili fotografu"
          queryKey={QUERY_KEY_FOR.search}
          type="text"
        />

        <UrlPersistedSelect
          initialValue={String(props.year)}
          label="Godina"
          name="year"
          queryKey={QUERY_KEY_FOR.year}
          options={[
            {
              label: "2023",
              value: "2023",
            },
            {
              label: "2022",
              value: "2022",
            },
          ]}
        />
      </div>
      <LoadingArea
        className="mt-10 flex flex-col gap-20 br:mt-16"
        position="top right"
      >
        <GalleryList forYear={forYear} initialSearch={props.search} />
      </LoadingArea>
    </>
  );
};

export default PageMultimediaEventsHome;
