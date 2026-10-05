import axios from "axios";
import { GEOCODING_URL } from "../config/env";
import createCachedRequest from "../lib/cache";

/**
 * Reverse-geocoding service backed by OpenStreetMap Nominatim
 * (free, keyless). Cross-domain integration: map coordinates -> human
 * address data for the add-bookmark flow.
 * @module services/geocodingService
 */

/** Nominatim asks for low request volume -> reuse answers for 10 minutes. */
const REVERSE_GEOCODE_TTL_MS = 10 * 60_000;

/**
 * Turn a coordinate into { cityName, country, countryCode }.
 * @param {number|string} lat
 * @param {number|string} lng
 * @returns {Promise<{ cityName: string, country: string, countryCode: string }>}
 * @throws when the coordinate is not tied to a populated place
 */
async function fetchReverseGeocode(lat, lng) {
  const { data } = await axios.get(GEOCODING_URL, {
    params: { format: "jsonv2", lat, lon: lng, zoom: 10 },
    headers: { "Accept-Language": "en" },
    timeout: 8_000,
  });

  const address = data?.address ?? {};
  const countryCode = (address.country_code ?? "").toUpperCase();

  if (!countryCode) {
    throw new Error(
      "This location is not a city — please click somewhere else",
    );
  }

  return {
    cityName:
      address.city ??
      address.town ??
      address.village ??
      address.municipality ??
      "",
    country: address.country ?? "",
    countryCode,
  };
}

/**
 * Cached reverse geocoding — re-clicking the same spot (or React's
 * StrictMode double-invoked effect) never issues a second Nominatim call.
 * @type {(lat: number|string, lng: number|string) => Promise<{ cityName: string, country: string, countryCode: string }>}
 */
export const reverseGeocode = createCachedRequest(fetchReverseGeocode, {
  ttl: REVERSE_GEOCODE_TTL_MS,
});
