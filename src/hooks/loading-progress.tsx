import { useIsFetching } from "@tanstack/react-query";
import { useRouter } from "next/router";
import NProgress from "nprogress";
import { useCallback, useEffect } from "react";

export const useLoadingProgress = ({
  onStart,
  onDone,
}: { onStart?: <T>() => T; onDone?: <T>() => T } = {}) => {
  const isFetching = useIsFetching({
    stale: false,
  });
  const router = useRouter();
  const routerEvents = router.events as typeof router.events | undefined;

  const loaderStart = useCallback(() => {
    if (NProgress.isStarted()) {
      return;
    }

    onStart?.();
    NProgress.start();
  }, [onStart]);

  const loaderDone = useCallback(() => {
    onDone?.();
    NProgress.done(true);
  }, [onDone]);

  useEffect(() => {
    NProgress.configure({
      trickle: true,
      trickleSpeed: 100,
    });
  }, []);

  useEffect(() => {
    routerEvents?.on("routeChangeStart", loaderStart);
    routerEvents?.on("routeChangeComplete", loaderDone);
    routerEvents?.on("routeChangeError", loaderDone);

    return () => {
      routerEvents?.off("routeChangeStart", loaderStart);
      routerEvents?.off("routeChangeComplete", loaderDone);
      routerEvents?.off("routeChangeError", loaderDone);
    };
  }, [loaderStart, loaderDone, routerEvents]);

  useEffect(() => {
    if (isFetching > 0) {
      loaderStart();
    } else {
      loaderDone();
    }
  }, [loaderStart, loaderDone, isFetching]);
};
