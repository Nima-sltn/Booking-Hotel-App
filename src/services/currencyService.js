import axios from "axios";
import { EXCHANGE_RATES_URL, SUPPORTED_CURRENCIES } from "../config/env";

/**
 * Currency conversion service backed by open.er-api.com (free, keyless).
 * Cross-domain integration: travel prices <-> foreign-exchange rates.
 * Rates are fetched with EUR as the base because the dataset is priced in EUR.
 * @module services/currencyService
 */

/**
 * Fetch exchange rates relative to EUR.
 * @returns {Promise<Record<string, number>>} e.g. { EUR: 1, USD: 1.08, ... }
 */
export async function getRates() {
  const { data } = await axios.get(`${EXCHANGE_RATES_URL}/EUR`, {
    timeout: 8_000,
  });
  if (!data.result || !data.rates) {
    throw new Error("Exchange rates are unavailable right now");
  }
  return data.rates;
}

/**
 * Convert an amount priced in EUR into a target currency.
 * @param {number} amountEUR
 * @param {string} currency e.g. "USD"
 * @param {Record<string, number>} rates rates relative to EUR
 * @returns {number}
 */
export function convertFromEUR(amountEUR, currency, rates) {
  const rate = rates?.[currency];
  if (!rate || Number.isNaN(Number(amountEUR))) return Number(amountEUR);
  return Number(amountEUR) * rate;
}

/**
 * Format a number as currency using the browser locale.
 * @param {number} value
 * @param {string} currency
 * @returns {string}
 */
export function formatMoney(value, currency) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "JPY" ? 0 : 2,
  }).format(value);
}

export { SUPPORTED_CURRENCIES };
