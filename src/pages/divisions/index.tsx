import { type GetStaticPropsContext, type NextPage } from "next";
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

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const helpers = await createApi(context);

  return {
    props: {
      divisions: await helpers.divisions.getDivisions.fetch(),
    },
  };
};

type Props = ServerSideProps<typeof getStaticProps>;

const PageDivisionsHome: NextPage<Props> = ({ divisions }) => {
  if (!divisions) {
    return null;
  }

  return (
    <>
      <NextSeo title="Sekcije" />
      <h1 className="text-2xl font-bold uppercase tracking-widest opacity-30">
        Sekcije
      </h1>

      <div className="grid items-baseline gap-x-12 py-6 max-br:gap-y-8 br:grid-cols-[minmax(0,2fr),minmax(0,1fr)]">
        <div className="order-2 flex flex-col divide-y br:order-1">
          {divisions.map((division) => {
            return (
              <div
                key={division.id}
                className="grid gap-4 border-white/20 py-6 first:pt-0 last:pb-0 br:grid-cols-[auto,minmax(0,1fr)] br:gap-9"
              >
                <div className="aspect-square overflow-hidden rounded-full br:w-32">
                  <AppImage
                    alt={`${division.name} logo`}
                    mode="cover"
                    src={division.icon.src}
                    aspect={{
                      ratio: 1,
                    }}
                  />
                </div>

                <div className="flex flex-col">
                  <h1 className="text-lg font-bold tracking-widest">
                    {division.name}
                  </h1>

                  <p className="mb-2 mt-1">{division.description}</p>

                  <Link
                    className="mt-auto flex uppercase no-underline"
                    href={{
                      pathname: "/divisions/[slug]",
                      query: {
                        slug: division.slug,
                      },
                    }}
                  >
                    <span className="flex items-center gap-[.25em] max-br:ml-auto">
                      Saznaj više <IconArrowRight />
                    </span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="order-1 flex flex-col items-baseline gap-8 self-stretch br:order-2">
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
              className="mt-8 inline-block bg-primary px-7 py-3 text-center font-bold uppercase tracking-wide text-black no-underline"
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
