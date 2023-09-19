import { type NextPage } from "next";
import { type LinkProps } from "next/link";
import { NextSeo } from "next-seo";

import { LinkWithArrow } from "~/components/base/link/LinkWithIcon";

const items = [
  {
    title: "Izložbe",
    description: "Galerija svih izložbi u ksetu",
    link: "#",
    image: "https://placekitten.com/1200/630",
  },
  {
    title: "Video arhiva",
    description: "Galerija fotografija s koncerata održanih u ksetu",
    link: "#",
    image: "https://placekitten.com/1201/631",
  },
  {
    title: "Disco mixevi",
    description: "Stajaznam",
    link: "#",
    image: "https://placekitten.com/1202/632",
  },
  {
    title: "Gorski list",
    description: "Galerija svih izložbi u ksetu",
    link: "#",
    image: "https://placekitten.com/1203/633",
  },
] satisfies {
  title: string;
  description: string;
  link: LinkProps["href"];
  image: string;
}[];

const PageMultimediaHome: NextPage = () => {
  return (
    <>
      <NextSeo title="Multimedia" />

      <div
        className="flex aspect-[2/1] w-full flex-col items-center justify-center bg-cover bg-no-repeat p-6 text-white"
        style={{
          backgroundImage: "url(https://placekitten.com/1200/630)",
        }}
      >
        <h2 className="text-2xl font-bold tracking-widest">
          Fotogalerija događaja
        </h2>
        <p className="mt-2 tracking-wide">
          Galerija fotografija s evenata održanih u ksetu
        </p>

        <div className="mt-4">
          <LinkWithArrow
            className="font-bold uppercase tracking-wide"
            href="/multimedia/events"
          >
            Vidi galeriju
          </LinkWithArrow>
        </div>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-2 br:grid-cols-3">
        {items.map((item) => {
          return (
            <div
              key={item.title}
              className="flex flex-col bg-secondary px-5 py-3"
            >
              <img
                alt={item.title}
                className="aspect-[11/9] object-cover object-center"
                src={item.image}
              />

              <h3 className="mt-3 text-2xl font-bold tracking-widest">
                {item.title}
              </h3>
              <p className="mb-2 mt-2 tracking-wide">{item.description}</p>

              <LinkWithArrow className="mt-auto" href={item.link as never}>
                Vidi više
              </LinkWithArrow>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default PageMultimediaHome;
