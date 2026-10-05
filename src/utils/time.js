/**
 * Time-zone aware clock helpers.
 *
 * Building an `Intl.DateTimeFormat` is expensive, so instances are memoized
 * in a **module-level Map** — lexically scoped state that every function in
 * this file shares and that no caller can reach or mutate.
 *
 * @module utils/time
 */

const formatterCache = new Map();

/** Cache keys (lexical constants) for the formatter shapes we need. */
const LOCAL_CLOCK_KEY = "clock:local";
const SHORT_TIME_KEY = "time:local";
const DAY_KEY = "day";
const DAY_YEAR_KEY = "day:year";

const CLOCK_OPTIONS = {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
};

const SHORT_OPTIONS = {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
};

const DAY_OPTIONS = { month: "short", day: "numeric" };

const DAY_YEAR_OPTIONS = { month: "short", day: "numeric", year: "numeric" };

/**
 * Build (once) and return an `Intl.DateTimeFormat` for `key`.
 * @param {string} key cache key
 * @param {Intl.DateTimeFormatOptions} options
 * @returns {Intl.DateTimeFormat}
 */
function getFormatter(key, options) {
  const cached = formatterCache.get(key);
  if (cached) return cached;

  const formatter = new Intl.DateTimeFormat(undefined, options);
  formatterCache.set(key, formatter);
  return formatter;
}

/**
 * Clock time (`HH:mm:ss`, 24h) for a date, in an IANA time zone.
 * Falls back to the browser's own zone when the zone is missing or invalid,
 * so a bad API payload can never crash the UI.
 *
 * @param {Date|number|string} date
 * @param {string} [timeZone] e.g. `"Europe/Amsterdam"`; omit for local time
 * @returns {string}
 */
export function formatClockTime(date, timeZone) {
  if (!timeZone) {
    return getFormatter(LOCAL_CLOCK_KEY, CLOCK_OPTIONS).format(date);
  }
  try {
    return getFormatter(timeZone, { ...CLOCK_OPTIONS, timeZone }).format(date);
  } catch {
    // Unknown/invalid zone -> cache nothing, render local time instead.
    return getFormatter(LOCAL_CLOCK_KEY, CLOCK_OPTIONS).format(date);
  }
}

/**
 * Short local time (`HH:mm`, 24h) — used for "updated at" hints.
 * @param {Date|number|string} date
 * @returns {string}
 */
export function formatShortTime(date) {
  return getFormatter(SHORT_TIME_KEY, SHORT_OPTIONS).format(date);
}

/**
 * Day of the month for range labels, e.g. `"Oct 5"` / `"Oct 5, 2026"`
 * (localized to the browser, unlike a hard-coded format string).
 * Replaces `date-fns/format` in the header so the calendar chunk stays out
 * of the initial bundle.
 *
 * @param {Date|number|string} date
 * @param {{ withYear?: boolean }} [options]
 * @returns {string}
 */
export function formatMonthDay(date, { withYear = false } = {}) {
  return withYear
    ? getFormatter(DAY_YEAR_KEY, DAY_YEAR_OPTIONS).format(date)
    : getFormatter(DAY_KEY, DAY_OPTIONS).format(date);
}
