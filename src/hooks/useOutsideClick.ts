import { useEffect, RefObject } from "react";

export default function useOutsideClick(
  ref: RefObject<HTMLElement>, 
  exceptionId: string, 
  cb: () => void
): void {
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (
        ref.current &&
        !ref.current.contains(target) &&
        target.id !== exceptionId
      ) {
        cb();
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [ref, cb, exceptionId]);
}
