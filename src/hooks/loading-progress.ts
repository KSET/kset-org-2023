import { useIsFetching } from "@tanstack/react-query";
import { type RouterEvent, useRouter } from "next/router";
import NProgress from "nprogress";
import { useEffect, useMemo } from "react";

import { useReducer } from "./reducer";

const LOADING_PROGRESS_START_DELAY = 150;

type ClearTimeoutParam = Parameters<typeof clearTimeout>[0];

export const useLoadingProgress = ({
  onStart,
  onDone,
}: { onStart?: <T>() => T; onDone?: <T>() => T } = {}) => {
  const isFetching = useIsFetching({
    stale: false,
  });
  const router = useRouter();
  const routerEvents = router.events as typeof router.events | undefined;

  const [loadingState, setLoadingState] = useReducer(
    (
      prevState,
      action:
        | {
            type: "start";
            timeout?: ClearTimeoutParam;
          }
        | {
            type: "done";
          },
    ) => {
      clearTimeout(prevState.timeout);

      switch (action.type) {
        case "start": {
          return {
            isLoading: true,
            timeout: action.timeout,
          } as const;
        }
        case "done": {
          return {
            isLoading: false,
            timeout: undefined,
          } as const;
        }
      }
    },
    {
      isLoading: false,
      timeout: undefined,
    } as
      | {
          isLoading: false;
          timeout: undefined;
        }
      | {
          isLoading: true;
          timeout?: ClearTimeoutParam;
        },
  );

  useEffect(() => {
    if (!loadingState.isLoading) {
      setLoadingState({ type: "done" });

      onDone?.();
      if (NProgress.isStarted()) {
        NProgress.done(true);
      }
      return;
    }

    const timeout = setTimeout(() => {
      if (NProgress.isStarted()) {
        return;
      }

      onStart?.();
      NProgress.start();
    }, LOADING_PROGRESS_START_DELAY);

    setLoadingState({ type: "start", timeout });

    return () => {
      setLoadingState({ type: "done" });
    };
  }, [loadingState.isLoading, onDone, onStart]);

  useEffect(() => {
    NProgress.configure({
      trickle: true,
      trickleSpeed: 100,
      minimum: 0.2,
    });
  }, []);

  const routerEventHandlers = useMemo(
    () =>
      [
        [() => setLoadingState({ type: "start" }), ["routeChangeStart"]],
        [
          () => setLoadingState({ type: "done" }),
          ["routeChangeComplete", "routeChangeError"],
        ],
      ] satisfies [() => void, RouterEvent[]][],
    [],
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
  }, [routerEvents, routerEventHandlers]);

  useEffect(() => {
    if (isFetching > 0) {
      setLoadingState({ type: "start" });
    } else {
      setLoadingState({ type: "done" });
    }
  }, [isFetching]);
};
