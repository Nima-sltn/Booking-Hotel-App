import { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { CurrencyContext } from "./CurrencyContext";
import { STORAGE_KEYS, SUPPORTED_CURRENCIES } from "../config/env";
import useInterval from "../hooks/useInterval";
import {
  convertFromEUR,
  formatMoney,
  getRates,
} from "../services/currencyService";

/** Exchange rates drift slowly: re-fetch well before they can go stale. */
const RATES_REFRESH_INTERVAL_MS = 20 * 60 * 1000;

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
 * Currency engine: fetches live exchange rates on mount, re-fetches them on a
 * `setInterval` tick so a long-lived session never shows stale FX, and exposes
 * `convert`/`formatPrice` so any component can render EUR-priced data in the
 * user's chosen currency. Falls back to EUR if the rates API is unreachable.
 * @param {{ children: import("react").ReactNode }} props
 */
export default function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(getInitialCurrency);
  const [rates, setRates] = useState({ EUR: 1 });
  const [ratesStatus, setRatesStatus] = useState("loading");
  const [ratesUpdatedAt, setRatesUpdatedAt] = useState(null);

  /**
   * Load (or reload) exchange rates.
   * A later failure keeps the rates we already have — they stay usable until
   * the next tick — while an initial failure falls back to EUR.
   * @returns {Promise<Record<string, number>|null>} resolved rates or null
   */
  const refreshRates = useCallback(async () => {
    try {
      const nextRates = await getRates();
      setRates(nextRates);
      setRatesStatus("ready");
      setRatesUpdatedAt(Date.now());
      return nextRates;
    } catch {
      setRatesStatus((prev) => (prev === "ready" ? prev : "failed"));
      return null;
    }
  }, []);

  // Initial load: a promise chain that races nothing (single mount effect).
  useEffect(() => {
    let cancelled = false;
    getRates()
      .then((nextRates) => {
        if (cancelled) return;
        setRates(nextRates);
        setRatesStatus("ready");
        setRatesUpdatedAt(Date.now());
      })
      .catch(() => {
        if (!cancelled) setRatesStatus("failed");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Keep the rates fresh in the background (cleared automatically on unmount).
  useInterval(refreshRates, RATES_REFRESH_INTERVAL_MS);

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
      ratesUpdatedAt,
      convert,
      formatPrice,
    }),
    [
      currency,
      effectiveCurrency,
      ratesStatus,
      ratesUpdatedAt,
      convert,
      formatPrice,
    ],
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
