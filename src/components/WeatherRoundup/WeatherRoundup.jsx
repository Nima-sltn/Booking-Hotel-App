import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getForecast, getWeatherMeta } from "../../services/weatherService";

/**
 * Weather round-up strip: current conditions for **every** saved destination
 * at a glance.
 *
 * Cross-domain: bookmark geodata -> meteorology. The forecasts are fetched in
 * parallel with `Promise.allSettled`, so one unreachable city degrades to a
 * missing chip instead of failing the whole strip (and cached coordinates
 * from the detail page are reused instantly).
 *
 * @param {{ bookmarks: Array<object> }} props
 */
function WeatherRoundup({ bookmarks }) {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    if (bookmarks.length === 0) {
      setCities([]);
      return undefined;
    }

    let cancelled = false;

    Promise.allSettled(
      bookmarks.map((bookmark) =>
        getForecast(bookmark.latitude, bookmark.longitude),
      ),
    ).then((results) => {
      if (cancelled) return;
      setCities(
        results.flatMap((result, index) => {
          if (result.status !== "fulfilled") return [];
          const bookmark = bookmarks[index];
          const { current } = result.value;
          return [
            {
              id: bookmark.id,
              cityName: bookmark.cityName ?? bookmark.country ?? "Saved place",
              temperature: current.temperature,
              weatherCode: current.weatherCode,
              isNight: current.isNight,
            },
          ];
        }),
      );
    });

    return () => {
      cancelled = true;
    };
  }, [bookmarks]);

  if (cities.length === 0) return null;

  return (
    <section
      aria-label="Weather right now at your saved destinations"
      className="mt-4 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
        Weather right now
      </h3>
      <ul className="flex flex-wrap gap-2">
        {cities.map((city) => {
          const { label, Icon } = getWeatherMeta(city.weatherCode, city.isNight);
          return (
            <li
              key={city.id}
              title={`${city.cityName}: ${label}, ${Math.round(city.temperature)}°C`}
              className="flex items-center gap-1.5 rounded-xl bg-slate-50 px-2.5 py-1.5 dark:bg-slate-800/60">
              <Icon
                className="h-5 w-5 shrink-0 text-indigo-500"
                aria-hidden="true"
              />
              <span className="max-w-24 truncate text-xs font-semibold text-slate-700 dark:text-slate-200">
                {city.cityName}
              </span>
              <span className="text-xs font-bold tabular-nums text-slate-900 dark:text-white">
                {Math.round(city.temperature)}°
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

WeatherRoundup.propTypes = {
  bookmarks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      latitude: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      longitude: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      cityName: PropTypes.string,
      country: PropTypes.string,
    }),
  ).isRequired,
};

export default WeatherRoundup;
