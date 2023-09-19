import { useCallback, useEffect, useRef, useState } from "react";

const getRemainingTime = (lastTriggeredTime: number, throttleMs: number) => {
  const elapsedTime = Date.now() - lastTriggeredTime;
  const remainingTime = throttleMs - elapsedTime;

  return remainingTime < 0 ? 0 : remainingTime;
};

export const useThrottledValue = <T>(value: T, throttleMs: number) => {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastTriggered = useRef<number>(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    let remainingTime = getRemainingTime(lastTriggered.current, throttleMs);

    if (remainingTime === 0) {
      lastTriggered.current = Date.now();
      cancel();
      setThrottledValue(value);
    } else if (!timeoutRef.current) {
      timeoutRef.current = setTimeout(() => {
        remainingTime = getRemainingTime(lastTriggered.current, throttleMs);

        if (remainingTime === 0) {
          lastTriggered.current = Date.now();
          cancel();
          setThrottledValue(value);
        }
      }, remainingTime);
    }

    return cancel;
  }, [cancel, throttleMs, value]);

  return throttledValue;
};

export const useThrottledState = <T>(initialValue: T, throttleMs: number) => {
  const [state, setState] = useState<T>(initialValue);
  const throttledState = useThrottledValue(state, throttleMs);

  return {
    state,
    throttledState,
    setState,
  } as const;
};

export const useThrottledFunction = (
  callbackFn: <T>(args?: T) => never,
  throttleMs: number,
) => {
  const lastTriggered = useRef<number>(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const throttledFn = useCallback(
    <T>(args?: T) => {
      let remainingTime = getRemainingTime(lastTriggered.current, throttleMs);

      if (remainingTime === 0) {
        lastTriggered.current = Date.now();
        cancel();
        callbackFn(args);
      } else if (!timeoutRef.current) {
        timeoutRef.current = setTimeout(() => {
          remainingTime = getRemainingTime(lastTriggered.current, throttleMs);

          if (remainingTime === 0) {
            lastTriggered.current = Date.now();
            cancel();
            callbackFn(args);
          }
        }, remainingTime);
      }
    },
    [callbackFn, cancel, throttleMs],
  );

  useEffect(() => cancel, [cancel]);

  return [throttledFn, { cancel }] as const;
};
