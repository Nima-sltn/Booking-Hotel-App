/**
 * Geodesy helpers: great-circle distance on a sphere (haversine formula).
 *
 * Cross-domain glue between the booking dataset (its `latitude`/`longitude`
 * columns) and cartography — used to summarise how far apart the saved
 * destinations are without calling any external API.
 *
 * @module utils/geo
 */

/** Mean Earth radius in kilometres. */
const EARTH_RADIUS_KM = 6371;

/** @param {number} degrees @returns {number} radians */
const toRadians = (degrees) => (degrees * Math.PI) / 180;

/**
 * Coerce a coordinate to a finite number.
 * @param {unknown} value
 * @returns {number|null} null when the value is missing or not a number
 */
function toFiniteNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

/**
 * Great-circle distance between two coordinates, in kilometres.
 *
 * @param {number|string} lat1 latitude of the first point
 * @param {number|string} lng1 longitude of the first point
 * @param {number|string} lat2 latitude of the second point
 * @param {number|string} lng2 longitude of the second point
 * @returns {number|null} distance in km, or null if a coordinate is unusable
 */
export function distanceKm(lat1, lng1, lat2, lng2) {
  const φ1 = toFiniteNumber(lat1);
  const λ1 = toFiniteNumber(lng1);
  const φ2 = toFiniteNumber(lat2);
  const λ2 = toFiniteNumber(lng2);
  if (φ1 === null || λ1 === null || φ2 === null || λ2 === null) return null;

  const deltaLat = toRadians(φ2 - φ1);
  const deltaLng = toRadians(λ2 - λ1);

  const haversine =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRadians(φ1)) *
      Math.cos(toRadians(φ2)) *
      Math.sin(deltaLng / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(Math.min(1, haversine)));
}

/**
 * Total length of the route formed by `points` **in the given order**,
 * skipping entries that have no usable coordinates.
 *
 * @param {Array<{ latitude?: unknown, longitude?: unknown }>} points
 * @returns {number} kilometres (0 when fewer than two valid points)
 */
export function routeDistanceKm(points) {
  const valid = points
    .map((point) => ({
      lat: toFiniteNumber(point?.latitude),
      lng: toFiniteNumber(point?.longitude),
    }))
    .filter((point) => point.lat !== null && point.lng !== null);

  let total = 0;
  for (let i = 1; i < valid.length; i += 1) {
    const leg = distanceKm(
      valid[i - 1].lat,
      valid[i - 1].lng,
      valid[i].lat,
      valid[i].lng,
    );
    total += leg ?? 0;
  }
  return total;
}

/**
 * Format a distance for the UI: `"1,234 km"` (locale-aware, whole km).
 * @param {number} km
 * @returns {string}
 */
export function formatKm(km) {
  return `${new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
  }).format(Math.round(km))} km`;
}
