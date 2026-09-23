/**
 * Central runtime configuration.
 * Every external endpoint lives here so environments (dev/staging/prod)
 * can be reconfigured with Vite env variables instead of code edits.
 * @module config/env
 */

/** Base URL of the JSON Server REST API. Override with `VITE_API_URL`. */
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:5000";

/** Nominatim reverse geocoding (map click -> city/country, free & keyless). */
export const GEOCODING_URL =
  "https://nominatim.openstreetmap.org/reverse";

/** Open-Meteo forecast API (free, no API key). */
export const WEATHER_FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

/** open.er-api.com exchange rates (free, no API key). */
export const EXCHANGE_RATES_URL = "https://open.er-api.com/v6/latest";

/** Currencies offered in the currency switcher. */
export const SUPPORTED_CURRENCIES = ["EUR", "USD", "GBP", "JPY", "CAD", "CHF"];

/** Storage keys used for client-side persistence. */
export const STORAGE_KEYS = {
  user: "stayfinder:user",
  theme: "stayfinder:theme",
  currency: "stayfinder:currency",
};
