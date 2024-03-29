import { type GetServerSidePropsContext, type NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { type FC, useEffect, useState } from "react";

import VariantImage from "~/components/base/image/variant-image";
import LoadingArea from "~/components/base/loading";
import { type ServerSideProps } from "~/types/server";
import { cn } from "~/utils/class";
import { src } from "~/utils/kset-image";
import { api } from "~/utils/queryApi";
import { trimHtmlToTextOfLength } from "~/utils/string";

export const getServerSideProps = (context: GetServerSidePropsContext) => {
  const queryYear = parseInt(String(context.query.year), 10);
  const year = Number.isInteger(queryYear)
    ? Number(queryYear)
    : new Date().getFullYear();

  return {
    props: {
      year,
    },
  };
};

type Props = ServerSideProps<typeof getServerSideProps>;

const NewsDateFormatter = new Intl.DateTimeFormat("hr-HR", {
  day: "numeric",
  month: "numeric",
  year: "numeric",
});

const NewsList: FC<{
  year: number;
}> = ({ year }) => {
  const [data] = api.news.getNewsForYear.useSuspenseQuery(
    {
      year,
    },
    {
      staleTime: 5 * 60 * 1000,
    },
  );

  const [firstItem, ...restItems] = data.items;

  if (!firstItem) {
    return (
      <>
        <NextSeo title={`Vijesti iz ${data.forYear}.`} />

        <div className="text-center">
          <h1 className="text-2xl font-bold">Nema vijesti za {year}.</h1>
        </div>
      </>
    );
  }

  return (
    <>
      <NextSeo title={`Vijesti iz ${data.forYear}.`} />

      <article id={`news_${firstItem.slug ?? firstItem.id}`}>
        <Link
          className="text-white no-underline opacity-90 transition-opacity duration-300 hover:opacity-100 hover:duration-0 br:grid br:grid-cols-[minmax(0,65fr),minmax(0,35fr)] br:gap-8"
          href={{
            pathname: "/news/[slug]",
            query: {
              slug: firstItem.slug,
            },
          }}
        >
          <VariantImage
            alt={firstItem.subject}
            aspectRatio={2}
            className="w-full"
            src={src(firstItem.thumb)}
          />

          <div className="flex flex-col justify-center">
            <div className="mb-2 mt-5 text-sm tracking-widest">
              <span className="text-primary">Ligma</span>
              <span className="mx-3 opacity-30">&mdash;</span>
              <time dateTime={firstItem.createdAt.toISOString()}>
                {NewsDateFormatter.format(firstItem.createdAt)}
              </time>
            </div>

            <h2 className="text-xl font-bold tracking-wide">
              {firstItem.subject}
            </h2>

            <div className="mt-4 text-lg tracking-wide opacity-60">
              {trimHtmlToTextOfLength(
                firstItem.description ?? firstItem.content,
                250,
              )}
            </div>
          </div>
        </Link>
      </article>

      <div className="mt-12 grid gap-12 br:mt-12 br:grid br:grid-cols-3 br:gap-x-8 br:gap-y-24">
        {restItems.map((newsItem) => {
          return (
            <article
              key={newsItem.id}
              className="flex"
              id={`news_${newsItem.slug ?? newsItem.id}`}
            >
              <Link
                className={cn(
                  "w-full text-white no-underline opacity-90 transition-opacity duration-300 hover:opacity-100 hover:duration-0",
                  !newsItem.thumb ? "mt-auto" : null,
                )}
                href={{
                  pathname: "/news/[slug]",
                  query: {
                    slug: newsItem.slug,
                  },
                }}
              >
                <VariantImage
                  alt={newsItem.subject}
                  aspectRatio={16 / 10}
                  className="w-full"
                  src={src(newsItem.thumb)}
                />

                <div className="mb-2 mt-5 text-sm tracking-widest">
                  <span className="text-primary">Ligma</span>
                  <span className="mx-3 opacity-30">&mdash;</span>
                  <time dateTime={newsItem.createdAt.toISOString()}>
                    {NewsDateFormatter.format(newsItem.createdAt)}
                  </time>
                </div>

                <h4 className="text-lg font-bold tracking-wide">
                  {newsItem.subject}
                </h4>

                <div className="mt-2 line-clamp-3 tracking-wide opacity-60">
                  {trimHtmlToTextOfLength(
                    newsItem.description ?? newsItem.content,
                    250,
                  )}
                </div>
              </Link>
            </article>
          );
        })}
      </div>
    </>
  );
};

const PageNewsHome: NextPage<Props> = ({ year }) => {
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState(
    year ?? new Date().getFullYear(),
  );

  const [eventYears] = api.news.getYearsWithNews.useSuspenseQuery();

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
        <NewsList year={selectedYear} />
      </LoadingArea>
    </>
  );
};

export default PageNewsHome;
