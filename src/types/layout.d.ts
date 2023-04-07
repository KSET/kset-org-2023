import type { NextPage as NextPage_ } from "next";
import type { ReactElement, ReactNode } from "react";

type NextPageWithLayout<TProps = unknown, TInitialProps = TProps> = NextPage_<
  TProps,
  TInitialProps
> & {
  getLayout?: (page: ReactElement) => ReactNode;
};
