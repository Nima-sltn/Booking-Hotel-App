# Integrations & cross-domain APIs

Every external endpoint is declared once in `src/config/env.js`.

| Service            | Domain             | Used for                        | API key |
| ------------------ | ------------------ | ------------------------------- | ------- |
| JSON Server        | local REST         | hotels & bookmarks CRUD         | —       |
| Open-Meteo         | meteorology        | weather widgets                 | no      |
| open.er-api.com    | foreign exchange   | currency conversion             | no      |
| OpenStreetMap Nominatim | geocoding     | map click → city/country        | no      |
| OpenStreetMap tiles (via Leaflet) | cartography | map rendering           | no      |

## 1. JSON Server (dev API)

```bash
npm run server   # json-server --watch server/db.json --port 5000
```

Endpoints (via `hotelService` / `bookmarkService`):

```
GET    /hotels?q=<text>&accommodates_gte=<n>   # full-text + capacity filter
GET    /hotels/:id
GET    /bookmarks          POST /bookmarks
GET    /bookmarks/:id      DELETE /bookmarks/:id
```

Base URL override: `VITE_API_URL`.

## 2. Weather — Open-Meteo (`services/weatherService.js`)

```http
GET https://api.open-meteo.com/v1/forecast
    ?latitude=52.35&longitude=4.88
    &current=temperature_2m,weather_code,wind_speed_10m,is_day
    &daily=weather_code,temperature_2m_max,temperature_2m_min
    &timezone=auto&forecast_days=4
```

- WMO weather codes are mapped to a label + icon component
  (`getWeatherMeta(code, isNight)` — night variants for clear/cloudy/rain).
- Rendered by `<WeatherWidget lat lng />` on hotel and bookmark detail pages.
- On failure the widget hides itself — it never blocks the page.

## 3. Currency — open.er-api.com (`services/currencyService.js`)

```http
GET https://open.er-api.com/v6/latest/EUR
```

- Rates are fetched **once per session with EUR as the base** because the demo
  dataset is priced in EUR.
- `convertFromEUR(amount, currency, rates)` + `formatMoney()` (Intl.NumberFormat,
  JPY gets 0 fraction digits).
- The `<Price amount={50} perNight />` component is the only place components
  touch money — switch the header currency and every price updates.
- If the API fails, `CurrencyProvider` resolves the effective currency back to
  EUR so amounts are never mislabeled.

## 4. Reverse geocoding — Nominatim (`services/geocodingService.js`)

```http
GET https://nominatim.openstreetmap.org/reverse
    ?format=jsonv2&lat=...&lon=...&zoom=10
    Accept-Language: en
```

Flow:

1. User clicks the map → router navigates to `/bookmark/add?lat&lng`.
2. `reverseGeocode(lat, lng)` resolves `{ cityName, country, countryCode }`
   (`city|town|village|municipality` fallbacks).
3. Form is pre-filled but editable; the country flag renders from the code.
4. Submit → `POST /bookmarks` → redirect to the bookmark list.

Nominatim asks for low request volume (≈1 req/s) and an identifiable client —
fine for this demo's one-request-per-bookmark usage.

## 5. Map — Leaflet + OpenStreetMap tiles (`components/Map/CustomMap.jsx`)

- `leaflet/dist/leaflet.css` is imported from `node_modules` (no CDN `<link>`).
- Click anywhere = start add-bookmark flow (`DetectClick`).
- Center follows `?lat&lng` and the geolocation button (`ChangeCenter` uses a
  `useEffect` — no render-time side effects).
- Dark mode inverts the tiles (`.dark .leaflet-tile` filter) so the map stays
  usable at night.
- The "Use my location" button is a **sibling** of the Leaflet container, so
  its clicks can never trigger the map's click-to-bookmark handler.

## 6. Demo imagery (`public/images/`)

The original 2017 dataset linked to long-dead photo CDN URLs. The API now
serves **locally generated SVG cover art** (gradient + skyline + title, unique
per hotel) and initial-avatars for hosts — zero third-party image dependencies.
Any future image failure still degrades gracefully via
`utils/imageFallback.js`.
