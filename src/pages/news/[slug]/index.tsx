import { htmlToText } from "html-to-text";
import { type GetServerSidePropsContext } from "next";
import Link from "next/link";
import { NextSeo, type NextSeoProps } from "next-seo";
import { type FC } from "react";
import { RxArrowLeft as IconArrowLeft } from "react-icons/rx";

import VariantImage from "~/components/base/image/variant-image";
import { MainLayout } from "~/layouts/main";
import { type NextPageWithLayout } from "~/types/layout";
import { type ServerSideProps } from "~/types/server";
import { type TrpcResult } from "~/types/trpc";
import { cn } from "~/utils/class";
import { src } from "~/utils/kset-image";
import { api } from "~/utils/queryApi";
import { createApi } from "~/utils/serverApi";
import { trimHtmlToTextOfLength } from "~/utils/string";

import $style from "./index.module.scss";

type NewsItem = TrpcResult<"news.getNewsItem">;

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const helpers = await createApi(context);
  const slug = context.params!.slug! as string;
  const [newsItem, _recentNews] = await Promise.allSettled([
    helpers.news.getNewsItem.fetch({
      slug,
    }),
    helpers.news.getNews.prefetch({
      count: 3,
    }),
  ] as const);

  return {
    notFound: newsItem.status !== "fulfilled" || newsItem.value === null,
    props: {
      slug,
      trpcState: helpers.dehydrate(),
    },
  };
};

type Props = ServerSideProps<typeof getServerSideProps>;

const Seo: FC<{ newsItem: NewsItem }> = ({ newsItem }) => {
  const thumbSrc = src(newsItem.thumb);

  const config: NextSeoProps = {
    title: newsItem.subject,
    description: newsItem.description
      ? htmlToText(newsItem.description, { wordwrap: false }).replace(
          /\s+/gi,
          " ",
        )
      : undefined,
    openGraph: {
      type: "article",
      article: {
        section: "News",
        authors: ["KSET"],
        publishedTime: newsItem.createdAt.toISOString(),
        expirationTime: newsItem.expiresAt?.toISOString(),
      },
    },
  };

  if (thumbSrc) {
    config.openGraph = {
      ...config.openGraph,
      images: [
        {
          url: thumbSrc,
        },
      ],
    };
  }

  return <NextSeo {...config} />;
};

const PageNewsItem: NextPageWithLayout<Props> = ({ slug }) => {
  if (!slug) {
    return null;
  }

  const [newsItem] = api.news.getNewsItem.useSuspenseQuery({
    slug,
  });

  const [recentNews] = api.news.getNews.useSuspenseQuery({
    count: 3,
  });

  if (!newsItem) {
    return null;
  }

  const date = new Date(newsItem.createdAt);
  const thumbSrc = src(newsItem.thumb);

  return (
    <>
      <Seo newsItem={newsItem} />

      <div className="container mt-8 grid-cols-[1fr,4fr,1fr] justify-items-center tracking-wide br:mt-32 br:grid">
        <Link
          className="flex items-center gap-1 self-baseline justify-self-start font-bold leading-5 tracking-wider no-underline opacity-80 transition-opacity duration-300 hover:underline hover:opacity-100 hover:duration-0 max-br:mb-4"
          href={{
            pathname: "/news",
            query: {
              year: date.getFullYear(),
            },
            hash: `#news_${newsItem.slug!}`,
          }}
        >
          <IconArrowLeft /> Povratak
        </Link>

        <div className="pb-12">
          <time
            className="mb-2 block text-sm tracking-widest"
            dateTime={date.toISOString()}
          >
            {date.toLocaleDateString("hr-HR")}
          </time>
          <h1 className="text-4xl font-bold">{newsItem.subject}</h1>
          <h3
            dangerouslySetInnerHTML={{
              __html: newsItem.description ?? "",
            }}
            className="mt-4 text-xl opacity-60"
          />
        </div>
      </div>

      <article className="bg-white text-black">
        <div className="bg-gradient-to-b from-off-black from-40% to-40%">
          <div className="br:container">
            <VariantImage
              alt={newsItem.subject}
              className="h-full w-full"
              src={thumbSrc}
              aspect={{
                ratio: 16 / 8,
              }}
            />
          </div>
        </div>
        <div className="float-none clear-none w-auto py-8 br:py-16">
          <div className="flex justify-center br:container">
            <div
              dangerouslySetInnerHTML={{
                __html: newsItem.content ?? "",
              }}
              className={cn("w-4/5 br:w-2/3", $style.newsContent)}
            />
          </div>
        </div>
      </article>

      <div className="container py-14">
        <h2 className="text-2xl font-bold uppercase tracking-widest text-white opacity-30">
          Zadnje objave
        </h2>

        <div className="mt-8 grid grid-cols-1 items-baseline gap-8 br:grid-cols-3">
          {recentNews.filter(Boolean).map((newsItem) => {
            const thumbSrc = src(newsItem.thumb);

            return (
              <article key={newsItem.id}>
                <Link
                  className="text-white no-underline opacity-90 transition-opacity duration-300 hover:opacity-100 hover:duration-0"
                  href={{
                    pathname: "/news/[slug]",
                    query: {
                      slug: newsItem.slug,
                    },
                  }}
                >
                  <div>
                    <VariantImage
                      alt={newsItem.subject}
                      aspectRatio={16 / 10}
                      className="w-full"
                      src={thumbSrc}
                    />
                  </div>

                  <div className="mb-2 mt-5 text-sm tracking-widest">
                    <span className="text-primary">Ligma</span>
                    <span className="mx-3 opacity-30">&mdash;</span>
                    <time dateTime={newsItem.createdAt.toISOString()}>
                      {newsItem.createdAt.toLocaleDateString("hr-HR")}
                    </time>
                  </div>

                  <h4 className="text-lg font-bold tracking-wide">
                    {newsItem.subject}
                  </h4>

                  <p className="mt-2 line-clamp-3 tracking-wide opacity-60">
                    {trimHtmlToTextOfLength(
                      newsItem.description ?? newsItem.content,
                      250,
                    )}
                  </p>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </>
  );
};

PageNewsItem.getLayout = (page) => (
  <MainLayout className="max-w-[initial] !p-0 [&>header]:container">
    {page}
  </MainLayout>
);

export default PageNewsItem;
