import { NextSeo } from "next-seo";
import {
  type FC,
  type HTMLProps,
  type PropsWithChildren,
  type ReactNode,
} from "react";
import { RxDownload as IconDownload } from "react-icons/rx";

import {
  ImageCarousel,
  type ImageCarouselPropsStrict,
} from "~/components/base/carousel/ImageCarousel";
import { LinkWithArrow } from "~/components/base/link/LinkWithIcon";
import { MainLayout } from "~/layouts/main";
import { type NextPageWithLayout } from "~/types/layout";
import { cn } from "~/utils/class";
import {
  PAGE_ABOUT__CIRCLE_INFOS,
  PAGE_ABOUT__DOWNLOAD_ITEMS,
  PAGE_ABOUT__SPONSORS,
  SOCIAL_LINKS,
} from "~/utils/HELPER_DELETE_IN_FINAL_RELEASE";

const SidebarCard: FC<
  PropsWithChildren<
    HTMLProps<HTMLDivElement> & {
      title: ReactNode;
      text?: ReactNode;
    }
  >
> = ({ title, text, children, ...props }) => {
  return (
    <div {...props} className={cn("bg-secondary px-7 py-11", props.className)}>
      <h2 className="text-2xl font-bold tracking-wide">{title}</h2>

      {text ? <p className="mt-3 tracking-wide opacity-80">{text}</p> : null}

      {children}
    </div>
  );
};

const imagesOfClub = Array.from({ length: 10 }, (_, i) => {
  return {
    alt: `Fotka ${i}`,
    src: `https://loremflickr.com/${460 + i}/${460 + i}`,
  };
}) satisfies ImageCarouselPropsStrict["images"];

const PageAboutHome: NextPageWithLayout = () => {
  return (
    <>
      <NextSeo title="O klubu" />

      <div className="container">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-widest opacity-30">
            O Klubu
          </h1>

          <div className="grid items-baseline gap-x-12 py-6 max-br:gap-y-8 br:grid-cols-[minmax(0,2fr),minmax(0,1fr)]">
            <div className="text-lg leading-relaxed tracking-wide">
              <div>
                <h2 className="mt-11 text-2xl font-extrabold leading-normal">
                  Povijest kluba
                </h2>
                <p className="mt-2">
                  To je bivša kotlovnica smještena na sjeveroistočnom uglu
                  najboljeg fakulteta na svijetu(i pored C zgrade FER-a). Neki
                  ljudi tvrde da je &quot;Rupa&quot; unatoč brojnim
                  nelogičnostima te izjave. Za početak, Rupa je mjesto u
                  sjeverozapadnoj Hrvatskoj na granici sa Slovenijom.
                  <br />
                  <br />
                  Iako Klub u kotlovnici postoji od 1976., njegova povijest seže
                  puno dalje. Klub studenata elektrotehnike osnovan je 1969.
                  zaslugom tadašnjeg dekana - akademika Hrvoja Požara te
                  prodekana Vladimira Muljevića i Berislava Jurkovića uz
                  angažman studenata uključenih u aktivnosti Fakultetskog odbora
                  i “Našeg lista”. Bio je smješten u dvije prostorije u podrumu
                  C zgrade. Iz potrebe za zvučnim imenom, 1971. Klub je dobio
                  ime KSET, a samo pet godina kasnije, odlukom uprave Fakulteta
                  preseljen je u prostor dotadašnje kotlovnice te time postao
                  kultno mjesto na koje se svi rado vraćaju, ne samo studenti
                  FER-a već i drugih fakulteta.
                </p>
                <div className="mx-auto mb-20 mt-16 grid grid-cols-1 gap-x-5 gap-y-12 text-center br:grid-cols-3">
                  {PAGE_ABOUT__CIRCLE_INFOS.map(({ title, text, icon }) => {
                    return (
                      <div
                        key={title + text}
                        className="flex flex-col items-center"
                      >
                        <img
                          alt="KSET"
                          className="aspect-square h-20 w-20 rounded-full object-cover"
                          src={icon}
                        />
                        <h3 className="mt-2 text-lg font-bold leading-relaxed br:mt-6">
                          {title}
                        </h3>
                        <p className="text-base leading-snug [text-wrap:balance]">
                          {text}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <p>
                  To je bivša kotlovnica smještena na sjeveroistočnom uglu
                  najboljeg fakulteta na svijetu(i pored C zgrade FER-a). Neki
                  ljudi tvrde da je &quot;Rupa&quot; unatoč brojnim
                  nelogičnostima te izjave. Za početak, Rupa je mjesto u
                  sjeverozapadnoj Hrvatskoj na granici sa Slovenijom.
                </p>
              </div>

              <div className="mt-12">
                <h2 className="text-2xl font-extrabold leading-normal">
                  Članstvo
                </h2>
                <p className="mt-4">
                  Ono što članstvom u KSET-u možete dobiti su mogućnost
                  korištenja opreme Kluba, besplatne upade srijedom na različite
                  slušaonice i petkom na kultni KSET Caffe, druženje s najboljom
                  ekipom na svijetu i još mnogo toga... Čitajte dalje ili dođite
                  bilo koji dan u Klub i saznajte sami...
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <SidebarCard
                text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis in laoreet lectus. Vestibulum ante ipsum primis in faucibus orci"
                title="Kako se učlaniti?"
              >
                <LinkWithArrow className="mt-12 uppercase" href="#">
                  Saznaj više
                </LinkWithArrow>
              </SidebarCard>

              <SidebarCard
                text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis in laoreet lectus. Vestibulum ante ipsum primis in faucibus orci"
                title="Projekti"
              >
                <LinkWithArrow className="mt-12 uppercase" href="#">
                  Saznaj više
                </LinkWithArrow>
              </SidebarCard>

              <SidebarCard
                text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis in laoreet lectus. Vestibulum ante ipsum primis in faucibus orci"
                title="Alumni"
              >
                <LinkWithArrow className="mt-12 uppercase" href="#">
                  Saznaj više
                </LinkWithArrow>
              </SidebarCard>

              <SidebarCard title="Društvene mreže">
                <ul className="mt-3 text-xl leading-loose">
                  {SOCIAL_LINKS.map(({ icon, label, link }) => {
                    return (
                      <li key={link}>
                        <a
                          className="flex items-center gap-[.5em] text-white no-underline opacity-80 hover:underline hover:opacity-100"
                          href={link}
                          rel="noopener external noreferrer"
                          target="_blank"
                        >
                          {icon}
                          <span className="pb-px">{label}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </SidebarCard>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <h1 className="text-3xl font-bold uppercase tracking-widest">
            Fotke kluba
          </h1>

          <div className="mt-7">
            <ImageCarousel displayed={4} images={imagesOfClub} />
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 items-end gap-x-20 gap-y-12 br:grid-cols-3">
          {PAGE_ABOUT__DOWNLOAD_ITEMS.map((item) => {
            return (
              <div key={item.title}>
                <h2 className="text-2xl font-bold uppercase tracking-widest">
                  {item.title}
                </h2>

                <div className="mt-6 flex h-36 items-center justify-center rounded bg-zinc-800">
                  <div className="flex h-1/2 w-1/2 items-center justify-center">
                    {item.preview ? (
                      <img
                        alt={item.title}
                        className="h-full w-full object-contain object-center"
                        {...item.preview}
                      />
                    ) : (
                      <div className="aspect-square h-full rounded-full bg-stone-300" />
                    )}
                  </div>
                </div>

                <div className="mt-3 text-center">
                  <a className="no-underline" href={item.downloadLink}>
                    <span className="inline-flex items-center gap-[.5em]">
                      <IconDownload />
                      Preuzmi
                    </span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative mt-28 overflow-visible bg-white text-off-black">
        <div className="container py-12">
          <h1 className="text-3xl font-bold uppercase tracking-widest">
            Sponzori, utičnice i te pizdarije šta treba
          </h1>

          <div className="mt-8 grid grid-cols-2 gap-x-10 gap-y-4 br:grid-cols-5">
            {PAGE_ABOUT__SPONSORS.map((sponsor) => {
              return (
                <a
                  key={sponsor.link}
                  href={sponsor.link}
                  rel="noopener external noreferrer"
                  target="_blank"
                >
                  <img
                    {...sponsor.image.meta}
                    alt={sponsor.name}
                    className="h-full w-full object-contain object-center"
                    src={sponsor.image.src}
                  />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

PageAboutHome.getLayout = (page) => {
  return <MainLayout>{page}</MainLayout>;
};

export default PageAboutHome;
