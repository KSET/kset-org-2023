import { type NextPage } from "next";
import { NextSeo } from "next-seo";

import {
  AppInput,
  AppSelect,
  AppTextarea,
} from "~/components/base/input/app-input";

const INFO = {
  basic: {
    info: <a href="mailto:info@kset.org">info@kset.org</a>,
    program: <a href="mailto:booking@kset.org">booking@kset.org</a>,
    press: <a href="mailto:press@kset.org">press@kset.org</a>,
    adresa: "Unska 3, 10000 Zagreb",
    oib: "14504100762",
  },

  voditelji: {
    klub: [
      {
        name: "Ivan Bratović",
        email: "ivan.bratovic@kset.org",
      },
    ],
    bike: [
      {
        name: "Matija Purgar",
        email: "matija.purgar@kset.org",
      },
    ],
    disco: [
      {
        name: "Paolo Lanča",
        email: "paolo.lanca@kset.org",
      },
      {
        name: "Martin Habek",
        email: "martin.habek@kset.org",
      },
    ],
    dramska: [
      {
        name: "Ena Džanko",
        email: "ena.dzanko@kset.org",
      },
    ],
    foto: [
      {
        name: "Lucija Kolarić",
        email: "lucija.kolaric@kset.org",
      },
      {
        name: "Matija Roglić",
        email: "matija.roglic@kset.org",
      },
    ],
    glazbena: [
      {
        name: "Vid Marinović",
        email: "vid.marinovic@kset.org",
      },
    ],
    pijandure: [
      {
        name: "Matej Štefanac",
        email: "matej.stefanac@kset.org",
      },
    ],
    računarska: [
      {
        name: "Jakov Ivković",
        email: "jakov.ivkovic@kset.org",
      },
    ],
    tehnička: [
      {
        name: "Petra Malezija",
        email: "petra.malezija@kset.org",
      },
    ],
    video: [
      {
        name: "Jan Radanović",
        email: "jan.radanovic@kset.org",
      },
    ],
  },
};

const PageContact: NextPage = () => {
  return (
    <>
      <NextSeo title="Kontakt" />
      <div className="grid grid-cols-1 items-baseline gap-x-12 max-br:gap-y-8 br:grid-cols-[minmax(0,2fr),minmax(0,1fr)]">
        <div className="flex flex-col gap-14">
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-widest opacity-30">
              Kontaktiraj nas
            </h1>

            <form
              className="mt-7 grid grid-cols-1 gap-6 bg-secondary p-10 pb-16 br:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <AppInput label="Ime i prezime" name="full-name" />
              <AppInput name="email" />
              <AppSelect
                className="br:col-span-2"
                label="Razlog upita"
                name="reason"
                options={[]}
                placeholder="Unesi razlog upita"
              />
              <AppTextarea
                className="br:col-span-2"
                label="Upit"
                name="text"
                placeholder="Unesi upit"
              />
              <button
                className="justify-self-start bg-primary px-8 py-3.5 text-base font-bold uppercase tracking-wide text-black"
                type="submit"
              >
                Pošalji upit
              </button>
            </form>
          </div>

          <div>
            <h1 className="text-2xl font-bold uppercase tracking-widest opacity-30">
              Lokacija
            </h1>

            <div className="mt-9 aspect-[7/3] bg-gradient-to-br from-stone-300 from-40% to-green-300" />
          </div>
        </div>
        <div className="flex flex-col gap-16">
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-widest opacity-30">
              Osnovne informacije
            </h1>

            <table className="w-full table-fixed border-separate border-spacing-y-5 text-sm tracking-wide">
              {Object.entries(INFO.basic).map(([key, value]) => {
                return (
                  <tr key={key}>
                    <td className="align-top uppercase opacity-80">{key}</td>
                    <td className="align-top leading-tight">{value}</td>
                  </tr>
                );
              })}
            </table>
          </div>
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-widest opacity-30">
              Voditelji
            </h1>

            <table className="w-full table-fixed border-separate border-spacing-y-5 text-sm tracking-wide">
              {Object.entries(INFO.voditelji).map(([key, value]) => {
                return (
                  <tr key={key}>
                    <td className="align-top uppercase opacity-80">{key}</td>
                    <td className="flex flex-col gap-4 align-top text-sm leading-tight">
                      {value.map((v) => (
                        <div key={v.email}>
                          <h4 className="mb-1.5 text-lg font-bold leading-none">
                            {v.name}
                          </h4>
                          <a
                            className="leading-tight"
                            href={`mailto:${v.email}`}
                          >
                            {v.email}
                          </a>
                        </div>
                      ))}
                    </td>
                  </tr>
                );
              })}
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default PageContact;
