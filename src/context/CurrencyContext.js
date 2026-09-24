import { createContext, useContext } from "react";

/**
 * Currency context object (component-free module for fast refresh).
 * @module context/CurrencyContext
 */
export const CurrencyContext = createContext(undefined);

/**
 * Access the selected display currency and price helpers.
 * @returns {{
 *   currency: string,
 *   setCurrency: (c: string) => void,
 *   currencies: string[],
 *   ratesStatus: "loading"|"ready"|"failed",
 *   convert: (amountEUR: number) => number,
 *   formatPrice: (amountEUR: number) => string,
 * }}
 * @throws if used outside of {@link CurrencyProvider}
 */
export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (ctx === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return ctx;
}
