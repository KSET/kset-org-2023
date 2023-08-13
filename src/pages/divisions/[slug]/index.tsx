import { type GetServerSidePropsContext, type NextPage } from "next";
import Link from "next/link";
import { NextSeo } from "next-seo";
import { RxArrowLeft as IconArrowLeft } from "react-icons/rx";

import AppImage from "~/components/base/image/app-image";
import { type ServerSideProps } from "~/types/server";
import { cn } from "~/utils/class";
import { api } from "~/utils/queryApi";
import { createApi } from "~/utils/serverApi";

import $style from "./index.module.scss";

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const helpers = await createApi(context);
  const slug = context.params?.slug;

  if (!slug || Array.isArray(slug)) {
    return {
      props: {
        notFound: true,
        trpcState: helpers.dehydrate(),
        slug: "",
      },
    };
  }

  await helpers.divisions.getDivision.prefetch({
    slug,
  });

  return {
    props: {
      notFound: false,
      trpcState: helpers.dehydrate(),
      slug,
    },
  };
};

type Props = ServerSideProps<typeof getServerSideProps>;

const PageDivisionSpecificHome: NextPage<Props> = (props) => {
  const [division] = api.divisions.getDivision.useSuspenseQuery(
    {
      slug: props.slug ?? "",
    },
    {
      cacheTime: 60 * 60 * 1000,
    },
  );

  if (!props.slug || !division) {
    return null;
  }

  return (
    <>
      <NextSeo title={`Sekcije - ${division.name}`} />
      <div className="gap-20 br:grid br:grid-cols-[minmax(0,4fr),minmax(0,5fr)]">
        <div>
          <div className="mb-14">
            <Link
              className="flex items-center gap-1 font-bold uppercase leading-5 tracking-wide no-underline opacity-80 transition-opacity duration-300 hover:underline hover:opacity-100 hover:duration-0"
              href={{
                pathname: "/divisions",
              }}
            >
              <IconArrowLeft /> Povratak
            </Link>
          </div>

          <AppImage
            alt={`${division.name} logo`}
            height={division.icon.height}
            src={division.icon.src}
            width={division.icon.width}
          />
        </div>

        <div className="tracking-wide">
          <h1 className="text-4xl font-bold">{division.name}</h1>

          <div className="mt-4 text-xl">{division.description}</div>

          <div
            dangerouslySetInnerHTML={{
              __html: division.text,
            }}
            className={cn($style.divisionText, "mt-8 text-lg opacity-90")}
          />
        </div>
      </div>
    </>
  );
};

export default PageDivisionSpecificHome;
