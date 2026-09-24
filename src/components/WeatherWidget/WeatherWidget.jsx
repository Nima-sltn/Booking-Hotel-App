import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import { WiStrongWind } from "react-icons/wi";
import { getWeatherMeta, getForecast } from "../../services/weatherService";

/**
 * Live weather card for a coordinate (Open-Meteo).
 * Cross-domain integration: hotel/bookmark geodata -> meteorology.
 *
 * @param {{ lat: number|string, lng: number|string, className?: string }} props
 */
function WeatherWidget({ lat, lng, className = "" }) {
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [forecast, setForecast] = useState(null);

  useEffect(() => {
    if (!lat || !lng) {
      setStatus("error");
      return undefined;
    }

    let cancelled = false;
    setStatus("loading");

    getForecast(lat, lng)
      .then((data) => {
        if (cancelled) return;
        setForecast(data);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [lat, lng]);

  if (status === "error") return null;

  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 ${className}`}
      aria-label="Local weather"
    >
      <header className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Local weather
        </h3>
        {status === "loading" && (
          <span className="text-xs text-slate-400">Loading…</span>
        )}
      </header>

      {status === "ready" && forecast && (
        <>
          <CurrentWeather current={forecast.current} />
          <ul className="mt-3 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
            {forecast.daily.slice(1).map((day) => {
              const { label, Icon } = getWeatherMeta(day.weatherCode);
              return (
                <li key={day.date} className="text-center">
                  <p className="text-[11px] font-semibold uppercase text-slate-400">
                    {format(new Date(day.date), "EEE")}
                  </p>
                  <Icon
                    className="mx-auto my-0.5 h-6 w-6 text-indigo-500"
                    aria-label={label}
                    title={label}
                  />
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    {Math.round(day.max)}°
                    <span className="font-normal text-slate-400">
                      {" "}
                      {Math.round(day.min)}°
                    </span>
                  </p>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
}

function CurrentWeather({ current }) {
  const { label, Icon } = getWeatherMeta(current.weatherCode, current.isNight);

  return (
    <div className="flex items-center gap-4">
      <Icon
        className="h-14 w-14 shrink-0 text-indigo-500"
        aria-label={label}
        title={label}
      />
      <div className="min-w-0">
        <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {Math.round(current.temperature)}°C
        </p>
        <p className="truncate text-sm text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
          <WiStrongWind className="h-4 w-4" />
          {Math.round(current.windSpeed)} km/h wind
        </p>
      </div>
    </div>
  );
}

CurrentWeather.propTypes = {
  current: PropTypes.shape({
    temperature: PropTypes.number.isRequired,
    windSpeed: PropTypes.number.isRequired,
    weatherCode: PropTypes.number.isRequired,
    isNight: PropTypes.bool,
  }).isRequired,
};

WeatherWidget.propTypes = {
  lat: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  lng: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
};

export default WeatherWidget;
