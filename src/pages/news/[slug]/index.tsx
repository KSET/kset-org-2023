import { type GetServerSidePropsContext } from "next";
import Link from "next/link";
import { NextSeo } from "next-seo";
import { RxArrowLeft as IconArrowLeft } from "react-icons/rx";

import VariantImage from "~/components/base/image/variant-image";
import { MainLayout } from "~/layouts/main";
import { type NextPageWithLayout } from "~/types/layout";
import { type ServerSideProps } from "~/types/server";
import { type Maybe } from "~/types/util";
import { type RouterOutputs } from "~/utils/api";
import { cn } from "~/utils/class";
import { src } from "~/utils/kset-image";
import { createApi } from "~/utils/serverApi";

import $style from "./index.module.scss";

type NewsItem = NonNullable<RouterOutputs["news"]["getNewsItem"]>;
type NewsItemFixed = NonNullable<ReturnType<typeof fixNewsItem>>;

const fixNewsItem = (newsItem: Maybe<NewsItem>) => {
  if (!newsItem) {
    return null;
  }

  return {
    ...newsItem,
    // eslint-disable-next-line camelcase
    created_at: newsItem.created_at.toISOString(),
    // eslint-disable-next-line camelcase
    expire_at: newsItem.expire_at?.toISOString() ?? null,
  };
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const helpers = await createApi(context);
  const slug = context.params!.slug! as string;
  const [newsItem, recentNews] = await Promise.all([
    helpers.news.getNewsItem.fetch({
      slug,
    }),
    helpers.news.getNews.fetch({
      count: 3,
    }),
  ] as const);

  return {
    notFound: !newsItem,
    props: {
      newsItem: fixNewsItem(newsItem),
      recentNews: recentNews.map(fixNewsItem),
    },
  };
};

type Props = ServerSideProps<typeof getServerSideProps>;

// quick and dirty html stripping
const dirtyStripHtml = (html: Maybe<string>) => html?.replace(/<[^>]+>/g, "");

const trimToLength = (str: Maybe<string>, length: number) => {
  if (!str) {
    return undefined;
  }

  if (str.length <= length) {
    return str;
  }

  return `${str.slice(0, length - 1)}…`;
};

const getNewsDescription = (newsItem: Maybe<NewsItem | NewsItemFixed>) => {
  const content = dirtyStripHtml(newsItem?.description ?? newsItem?.content);

  return trimToLength(content, 250);
};

const PageNewsItem: NextPageWithLayout<Props> = ({ newsItem, recentNews }) => {
  const description = getNewsDescription(newsItem);

  if (!newsItem) {
    return null;
  }

  const date = new Date(newsItem.created_at);
  const thumbSrc = src(newsItem.thumb);

  return (
    <>
      <NextSeo
        description={description}
        title={newsItem.subject}
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
          {recentNews?.filter(Boolean).map((newsItem) => {
            const date = new Date(newsItem.created_at);
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
                    <time dateTime={newsItem.created_at}>
                      {date.toLocaleDateString("hr-HR")}
                    </time>
                  </div>

                  <h4 className="text-lg font-bold tracking-wide">
                    {newsItem.subject}
                  </h4>

                  <p className="mt-2 line-clamp-3 tracking-wide opacity-60">
                    {getNewsDescription(newsItem)}
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
