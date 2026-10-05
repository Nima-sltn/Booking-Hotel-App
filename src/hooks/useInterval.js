import { useEffect, useRef } from "react";

/**
 * Declarative `setInterval` with automatic cleanup.
 *
 * The interval always invokes the **latest** callback: `savedCallback.current`
 * is refreshed on every render, so the timer closes over a mutable ref
 * instead of capturing stale props/state from the render it was created in.
 * The interval itself is only re-created when `delay` changes, and it is
 * cleared on unmount (no timers leaking between routes).
 *
 * @param {() => void} callback function to run on every tick
 * @param {number|null|undefined} delay milliseconds between ticks;
 *   a nullish delay disables the interval
 */
export default function useInterval(callback, delay) {
  const savedCallback = useRef(callback);

  // Keep the newest callback without re-arming the timer.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay == null) return undefined;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}
