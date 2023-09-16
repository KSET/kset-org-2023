import "~/styles/globals.css";
import "~/styles/nprogress.scss";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { type AppContext, type AppType } from "next/app";
import NextApp from "next/app";
import Head from "next/head";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { DefaultSeo } from "next-seo";
import { CookiesProvider } from "react-cookie";
import UniversalCookie from "universal-cookie";

import { useLoadingProgress } from "~/hooks/loading-progress";
import { MainLayout } from "~/layouts/main";
import { type NextPageWithLayout } from "~/types/layout";
import { fontUi } from "~/utils/font";
import { api } from "~/utils/queryApi";

const getInitialProps = async (app: AppContext) => {
  return {
    ...(await NextApp.getInitialProps(app)),
    rawCookies: app.ctx.req?.headers.cookie,
  };
};

const MyApp: AppType<{
  session: Session | null;
  dehydratedState?: unknown;
}> = ({ Component, pageProps: { session, ...pageProps }, ...rest }) => {
  useLoadingProgress();

  const { getLayout } = Component as NextPageWithLayout;

  const { rawCookies } = rest as typeof rest &
    Awaited<ReturnType<typeof getInitialProps>>;
  const cookies = new UniversalCookie(rawCookies);

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <meta content="IE=Edge" httpEquiv="X-UA-Compatible" />
        <meta
          content="KSET, klub, studenti, fakultet, zagreb, elektrotehnika, računarstvo, hacker, volunteering, computing, electrical engineering, club, nightlife, university"
          name="keywords"
        />
        <meta content="45.80154" property="og:latitude" />
        <meta content="15.97166" property="og:longitude" />
        <meta content="Unska 3" property="og:street-address" />
        <meta content="Zagreb" property="og:locality" />
        <meta content="Zagreb" property="og:region" />
        <meta content="10000" property="og:postal-code" />
        <meta content="Croatia" property="og:country-name" />
      </Head>
      <DefaultSeo
        description="Klub studenata elektrotehnike, poznatiji kao KSET je zagrebački klub i okupljalište studenata Fakulteta elektrotehnike i računarstva (FER)."
        title="Klub studenata elektrotehnike"
        titleTemplate="KSET.org - %s"
        openGraph={{
          type: "website",
          locale: "hr_HR",
          url: "https://www.kset.org/",
          siteName: "KSET.org",
        }}
        twitter={{
          cardType: "summary_large_image",
        }}
      />
      <CookiesProvider cookies={cookies}>
        <SessionProvider session={session}>
          {getLayout ? (
            getLayout(<Component {...pageProps} />)
          ) : (
            <MainLayout className={`${fontUi.className} container mb-20`}>
              <Component {...pageProps} />
            </MainLayout>
          )}
          <ReactQueryDevtools />
        </SessionProvider>
      </CookiesProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
