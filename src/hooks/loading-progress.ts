import { useIsFetching } from "@tanstack/react-query";
import { useRouter } from "next/router";
import NProgress from "nprogress";
import { useCallback, useEffect, useMemo } from "react";

export const useLoadingProgress = ({
  onStart,
  onDone,
}: { onStart?: <T>() => T; onDone?: <T>() => T } = {}) => {
  const isFetching = useIsFetching({
    stale: false,
  });
  const router = useRouter();
  const routerEvents = router.events as typeof router.events | undefined;

  type RouterEvents = Parameters<NonNullable<typeof routerEvents>["on"]>[0];

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

  const routerEventHandlers: [() => void, RouterEvents[]][] = useMemo(
    () => [
      [loaderStart, ["routeChangeStart"]],
      [loaderDone, ["routeChangeComplete", "routeChangeError"]],
    ],
    [loaderStart, loaderDone],
  );

  useEffect(() => {
    if (!routerEvents) {
      return;
    }

    for (const [handler, events] of routerEventHandlers) {
      for (const event of events) {
        routerEvents.on(event, handler);
      }
    }

    return () => {
      for (const [handler, events] of routerEventHandlers) {
        for (const event of events) {
          routerEvents.off(event, handler);
        }
      }
    };
  }, [loaderStart, loaderDone, routerEvents, routerEventHandlers]);

  useEffect(() => {
    if (isFetching > 0) {
      loaderStart();
    } else {
      loaderDone();
    }
  }, [loaderStart, loaderDone, isFetching]);
};
