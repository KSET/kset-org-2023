import { type GetServerSidePropsContext, type NextPage } from "next";
import Link from "next/link";
import { NextSeo } from "next-seo";
import {
  type FC,
  type HTMLProps,
  type PropsWithChildren,
  type ReactNode,
} from "react";
import { RxArrowRight as IconArrowRight } from "react-icons/rx";

import AppImage from "~/components/base/image/app-image";
import { type ServerSideProps } from "~/types/server";
import { cn } from "~/utils/class";
import { api } from "~/utils/queryApi";
import { createApi } from "~/utils/serverApi";

const SidebarCard: FC<
  PropsWithChildren<
    HTMLProps<HTMLDivElement> & {
      title: ReactNode;
      text?: ReactNode;
    }
  >
> = ({ title, text, children, ...props }) => {
  return (
    <div {...props} className={cn("bg-secondary p-6", props.className)}>
      <h2 className="text-2xl font-bold tracking-wide">{title}</h2>

      {text ? <p className="mt-3 tracking-wide opacity-80">{text}</p> : null}

      {children}
    </div>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const helpers = await createApi(context);

  await helpers.divisions.getDivisions.prefetch();

  return {
    props: {
      trpcState: helpers.dehydrate(),
    },
  };
};

type Props = ServerSideProps<typeof getServerSideProps>;

const PageDivisionsHome: NextPage<Props> = () => {
  const [divisions] = api.divisions.getDivisions.useSuspenseQuery();

  return (
    <>
      <NextSeo title="Sekcije" />
      <h1 className="text-2xl font-bold uppercase tracking-widest opacity-30">
        Sekcije
      </h1>

      <div className="grid grid-cols-[minmax(0,2fr),minmax(0,1fr)] items-baseline gap-x-12">
        <div className="flex flex-col divide-y">
          {divisions.map((division) => {
            return (
              <div
                key={division.id}
                className="grid grid-cols-[auto,minmax(0,1fr)] gap-9 border-white/20 py-6"
              >
                <div className="aspect-square w-32 overflow-hidden rounded-full">
                  <AppImage
                    alt={`${division.name} logo`}
                    mode="cover"
                    src={division.icon.src}
                    aspect={{
                      ratio: 1,
                    }}
                  />
                </div>

                <div>
                  <h1 className="text-lg font-bold tracking-widest">
                    {division.name}
                  </h1>

                  <p className="mt-1">{division.description}</p>

                  <Link
                    className="mt-2 flex items-center gap-[.25em] uppercase no-underline"
                    href={{
                      pathname: "/divisions/[slug]",
                      query: {
                        slug: division.slug,
                      },
                    }}
                  >
                    Saznaj više <IconArrowRight />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col items-baseline gap-8 self-stretch">
          <SidebarCard
            text="Javi se na mail bla bla bla, consectetur adipiscing elit. Duis in"
            title="Kako se učlaniti?"
          >
            <div className="mt-5">
              <AppImage
                alt="Kako se uclaniti?"
                height={175}
                src="https://loremflickr.com/348/175"
                width={348}
              />
            </div>
          </SidebarCard>

          <SidebarCard title="Pronađi svoju sekciju i postani član KSET-a!">
            <p className="mt-9 tracking-wide opacity-80">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis in
              laoreet lectus. Vestibulum ante ipsum primis in faucibus orci
              luctus et ultrices posuere cubilia curae; Vivamus turpis dui,
              semper lobortis.
            </p>

            <a
              className="mt-8 inline-block bg-primary px-7 py-3 font-bold uppercase tracking-wide text-black no-underline"
              href="#"
            >
              Otkrij koja si sekcija
            </a>

            <div className="mt-12">
              <AppImage
                alt="Kako se uclaniti?"
                height={211}
                src="https://loremflickr.com/348/211"
                width={348}
              />
            </div>
          </SidebarCard>
        </div>
      </div>
    </>
  );
};

export default PageDivisionsHome;
