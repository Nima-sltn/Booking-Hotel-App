import { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { CurrencyContext } from "./CurrencyContext";
import { STORAGE_KEYS, SUPPORTED_CURRENCIES } from "../config/env";
import {
  convertFromEUR,
  formatMoney,
  getRates,
} from "../services/currencyService";

function getInitialCurrency() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.currency);
    if (SUPPORTED_CURRENCIES.includes(stored)) return stored;
  } catch {
    /* storage unavailable */
  }
  return "EUR";
}

/**
 * Currency engine: fetches live exchange rates once per session and exposes
 * `convert`/`formatPrice` so any component can render EUR-priced data in the
 * user's chosen currency. Falls back to EUR if the rates API is unreachable.
 * @param {{ children: import("react").ReactNode }} props
 */
export default function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(getInitialCurrency);
  const [rates, setRates] = useState({ EUR: 1 });
  const [ratesStatus, setRatesStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    getRates()
      .then((nextRates) => {
        if (cancelled) return;
        setRates(nextRates);
        setRatesStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setRatesStatus("failed");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.currency, currency);
    } catch {
      /* storage unavailable */
    }
  }, [currency]);

  /* If the rate for the chosen currency never arrived, price in EUR instead
     of mislabeling amounts with a stale/wrong currency. */
  const effectiveCurrency = rates[currency] ? currency : "EUR";

  const convert = useCallback(
    (amountEUR) => convertFromEUR(amountEUR, effectiveCurrency, rates),
    [effectiveCurrency, rates],
  );

  const formatPrice = useCallback(
    (amountEUR) => formatMoney(convert(amountEUR), effectiveCurrency),
    [convert, effectiveCurrency],
  );

  const value = useMemo(
    () => ({
      currency: effectiveCurrency,
      requestedCurrency: currency,
      setCurrency,
      currencies: SUPPORTED_CURRENCIES,
      ratesStatus,
      convert,
      formatPrice,
    }),
    [currency, effectiveCurrency, ratesStatus, convert, formatPrice],
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

CurrencyProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
