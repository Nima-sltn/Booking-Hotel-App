import { useEffect } from "react";

/**
 * Run `cb` when a pointer-down lands outside `ref`,
 * ignoring clicks on the element with id `exceptionId`
 * (e.g. the toggle button that opens the dropdown).
 *
 * @param {import("react").RefObject<HTMLElement>} ref
 * @param {string} exceptionId id of the toggle element
 * @param {() => void} cb callback invoked on outside click
 */
export default function useOutsideClick(ref, exceptionId, cb) {
  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        event.target.id !== exceptionId
      ) {
        cb();
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [ref, exceptionId, cb]);
}
