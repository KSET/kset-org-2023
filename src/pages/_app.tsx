import "~/styles/globals.css";
import "~/styles/nprogress.scss";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { type AppContext, type AppType } from "next/app";
import NextApp from "next/app";
import Head from "next/head";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { CookiesProvider } from "react-cookie";
import UniversalCookie from "universal-cookie";

import { useLoadingProgress } from "~/hooks/loading-progress";
import { MainLayout } from "~/layouts/main";
import { type NextPageWithLayout } from "~/types/layout";
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
      </Head>
      <CookiesProvider cookies={cookies}>
        <SessionProvider session={session}>
          {getLayout ? (
            getLayout(<Component {...pageProps} />)
          ) : (
            <MainLayout>
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
