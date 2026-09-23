import axios from "axios";
import {
  WiCloud,
  WiDayCloudy,
  WiDayFog,
  WiDayHail,
  WiDayRain,
  WiDayShowers,
  WiDaySleet,
  WiDaySnow,
  WiDaySunny,
  WiNightAltCloudy,
  WiNightAltRain,
  WiNightAltShowers,
  WiNightAltSnow,
  WiNightClear,
  WiThunderstorm,
} from "react-icons/wi";
import { WEATHER_FORECAST_URL } from "../config/env";

/**
 * Weather service backed by Open-Meteo (free, keyless).
 * Cross-domain integration: geospatial coordinates -> meteorological data.
 * @module services/weatherService
 */

const WMO_CODES = {
  0: { label: "Clear sky", Icon: WiDaySunny, nightIcon: WiNightClear },
  1: { label: "Mainly clear", Icon: WiDaySunny, nightIcon: WiNightClear },
  2: { label: "Partly cloudy", Icon: WiDayCloudy, nightIcon: WiNightAltCloudy },
  3: { label: "Overcast", Icon: WiCloud, nightIcon: WiNightAltCloudy },
  45: { label: "Fog", Icon: WiDayFog, nightIcon: WiDayFog },
  48: { label: "Rime fog", Icon: WiDayFog, nightIcon: WiDayFog },
  51: { label: "Light drizzle", Icon: WiDayShowers, nightIcon: WiNightAltShowers },
  53: { label: "Drizzle", Icon: WiDayShowers, nightIcon: WiNightAltShowers },
  55: { label: "Heavy drizzle", Icon: WiDayRain, nightIcon: WiNightAltRain },
  61: { label: "Light rain", Icon: WiDayRain, nightIcon: WiNightAltRain },
  63: { label: "Rain", Icon: WiDayRain, nightIcon: WiNightAltRain },
  65: { label: "Heavy rain", Icon: WiDayRain, nightIcon: WiNightAltRain },
  66: { label: "Freezing rain", Icon: WiDaySleet, nightIcon: WiNightAltRain },
  67: { label: "Freezing rain", Icon: WiDaySleet, nightIcon: WiNightAltRain },
  71: { label: "Light snow", Icon: WiDaySnow, nightIcon: WiNightAltSnow },
  73: { label: "Snow", Icon: WiDaySnow, nightIcon: WiNightAltSnow },
  75: { label: "Heavy snow", Icon: WiDaySnow, nightIcon: WiNightAltSnow },
  77: { label: "Snow grains", Icon: WiDaySnow, nightIcon: WiNightAltSnow },
  80: { label: "Rain showers", Icon: WiDayShowers, nightIcon: WiNightAltShowers },
  81: { label: "Rain showers", Icon: WiDayShowers, nightIcon: WiNightAltShowers },
  82: { label: "Violent showers", Icon: WiDayRain, nightIcon: WiNightAltRain },
  85: { label: "Snow showers", Icon: WiDaySnow, nightIcon: WiNightAltSnow },
  86: { label: "Snow showers", Icon: WiDaySnow, nightIcon: WiNightAltSnow },
  95: { label: "Thunderstorm", Icon: WiThunderstorm, nightIcon: WiThunderstorm },
  96: { label: "Thunderstorm + hail", Icon: WiDayHail, nightIcon: WiDayHail },
  99: { label: "Thunderstorm + hail", Icon: WiDayHail, nightIcon: WiDayHail },
};

/**
 * Map a WMO weather code to a human label and an icon component.
 * @param {number} code
 * @param {boolean} [isNight=false]
 * @returns {{ label: string, Icon: import("react").ComponentType }}
 */
export function getWeatherMeta(code, isNight = false) {
  const entry = WMO_CODES[code] ?? {
    label: "Unknown",
    Icon: WiDaySunny,
    nightIcon: WiNightClear,
  };
  return { label: entry.label, Icon: (isNight && entry.nightIcon) || entry.Icon };
}

/**
 * Fetch current conditions + a 4-day outlook for a coordinate.
 * @param {number|string} lat
 * @param {number|string} lon
 * @returns {Promise<{ current: object, daily: Array<object> }>}
 */
export async function getForecast(lat, lon) {
  const { data } = await axios.get(WEATHER_FORECAST_URL, {
    params: {
      latitude: lat,
      longitude: lon,
      current: "temperature_2m,weather_code,wind_speed_10m,is_day",
      daily: "weather_code,temperature_2m_max,temperature_2m_min",
      timezone: "auto",
      forecast_days: 4,
    },
    timeout: 8_000,
  });

  const current = {
    temperature: data.current.temperature_2m,
    windSpeed: data.current.wind_speed_10m,
    weatherCode: data.current.weather_code,
    isNight: data.current.is_day === 0,
    time: data.current.time,
  };

  const daily = data.daily.time.map((date, i) => ({
    date,
    weatherCode: data.daily.weather_code[i],
    max: data.daily.temperature_2m_max[i],
    min: data.daily.temperature_2m_min[i],
  }));

  return { current, daily };
}
