import { createContext, useContext } from "react";

/**
 * Hotel search context object (component-free module for fast refresh).
 * @module context/HotelsContext
 */
export const HotelContext = createContext(undefined);

/**
 * Access hotel search state and actions.
 * @throws if used outside of {@link HotelsProvider}
 */
export function useHotels() {
  const ctx = useContext(HotelContext);
  if (ctx === undefined) {
    throw new Error("useHotels must be used within a HotelsProvider");
  }
  return ctx;
}
