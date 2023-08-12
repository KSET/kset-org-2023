/**
 * This is the client-side entrypoint for your tRPC API. It is used to create the `api` object which
 * contains the Next.js App-wrapper, as well as your type-safe React Query hooks.
 *
 * We also create a few inference helpers for input and output types.
 */
import { type QueryClientConfig } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { type NextPageContext } from "next";
import superjson from "superjson";

import { type AppRouter } from "~/server/api/root";

import { getBaseUrl } from "./url";

const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      suspense: true,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      notifyOnChangeProps: "all",
    },
  },
};

/** A set of type-safe react-query hooks for your tRPC API. */
export const api = createTRPCNext<
  AppRouter,
  NextPageContext,
  "ExperimentalSuspense"
>({
  config({ ctx }) {
    if (typeof window !== "undefined") {
      // during client requests
      return {
        transformer: superjson, // optional - adds superjson serialization
        links: [
          httpBatchLink({
            url: "/api/trpc",
          }),
        ],
        queryClientConfig,
        abortOnUnmount: true,
      };
    }

    return {
      /**
       * Transformer used for data de-serialization from the server.
       *
       * @see https://trpc.io/docs/data-transformers
       */
      transformer: superjson,

      /**
       * Links used to determine request flow from client to server.
       *
       * @see https://trpc.io/docs/links
       */
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          /**
           * Set custom request headers on every request from tRPC
           * @link https://trpc.io/docs/v10/header
           */
          headers() {
            if (!ctx?.req?.headers) {
              return {};
            }
            // To use SSR properly, you need to forward the client's headers to the server
            // This is so you can pass through things like cookies when we're server-side rendering
            const {
              // If you're using Node 18 before 18.15.0, omit the "connection" header
              connection: _connection,
              ...headers
            } = ctx.req.headers;
            return headers;
          },
        }),
      ],

      queryClientConfig,
    };
  },
  /**
   * Whether tRPC should await queries when server rendering pages.
   *
   * @see https://trpc.io/docs/nextjs#ssr-boolean-default-false
   */
  ssr: true,
});
