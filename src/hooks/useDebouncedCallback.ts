import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react';

/**
 * Returns `run` (the debounced `callback`) plus `cancel` and `flush` helpers.
 * The latest callback is always invoked, so callers don't need to memoize it.
 */
export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay: number,
) {
  const callbackRef = useRef(callback);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pendingArgsRef = useRef<Args | undefined>(undefined);

  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  const cancel = useCallback(() => {
    clearTimeout(timerRef.current);
    timerRef.current = undefined;
    pendingArgsRef.current = undefined;
  }, []);

  const flush = useCallback(() => {
    const args = pendingArgsRef.current;
    cancel();
    if (args) callbackRef.current(...args);
  }, [cancel]);

  const run = useCallback(
    (...args: Args) => {
      clearTimeout(timerRef.current);
      pendingArgsRef.current = args;
      timerRef.current = setTimeout(flush, delay);
    },
    [delay, flush],
  );

  useEffect(() => cancel, [cancel]);

  return useMemo(() => ({ run, cancel, flush }), [run, cancel, flush]);
}
