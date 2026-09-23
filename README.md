# StayFinder — Hotel Booking SPA 🏨

A single-page hotel & home booking app built with **React + Vite + Tailwind CSS 4**.
Search stays, explore them side by side on an interactive map, bookmark the
destinations you love — with **live weather**, **multi-currency prices** and a
persisted **light/dark theme**.

---

## ✨ Features

### Core
- **Search** by destination, date range and guest/room counts — query state lives
  in the URL, so every search is shareable and bookmarkable.
- **Split layout**: scrollable results list + full-screen Leaflet map.
- **Hotel detail** with cover art, rating, facts, amenities, host card and price.
- **Bookmarks**: click any point on the map to save a destination
  (reverse-geocoded automatically), then list / open / delete them.
- **Auth**: demo login, protected routes, and redirect-back to the page you
  originally requested. Session survives refresh (localStorage).
- **404 page** and a top-level **error boundary** (no white screens).

### Cross-domain integrations (all free, keyless APIs)
- **🌤 Weather** — Open-Meteo forecast for every hotel and bookmark coordinate
  (current conditions + 3-day outlook with WMO weather-code icons).
- **💱 Currency conversion** — live exchange rates (open.er-api.com); switch
  EUR → USD/GBP/JPY/CAD/CHF and every price in the app re-renders.
- **📍 Reverse geocoding** — OpenStreetMap Nominatim turns a map click into
  city/country/country-code for the bookmark form.

### UI/UX
- Full **Tailwind CSS 4** design system (cards, buttons, forms, panels) with a
  consistent indigo/slate/rose palette.
- **Dark mode** engine (light/dark, persisted, respects `color-scheme`), including
  dark map tiles and a dark calendar.
- **Skeleton loaders**, empty states, hover/active micro-interactions,
  sticky glass header, responsive from mobile to wide desktop.
- **Sort control** (recommended / price ↑↓ / top rated) with highlighted
  current selection.
- Local **generated cover art** for the demo dataset — no external image CDN,
  plus an `onError` gradient fallback for any broken image.

---

## 🚀 Quick start

```bash
# 1. install dependencies
npm install

# 2. terminal A — local REST API (json-server on :5000)
npm run server

# 3. terminal B — dev server (Vite on :5173)
npm run dev
```

Open http://localhost:5173

**Demo credentials:** `nima@gmail.com` / `1234`

> The API base URL defaults to `http://localhost:5000` and can be overridden
> without code changes: `VITE_API_URL=https://my-api.example.com npm run dev`

---

## 📜 Scripts

| Script          | What it does                                   |
| --------------- | ---------------------------------------------- |
| `npm run dev`   | Start Vite dev server                          |
| `npm run server`| Start json-server REST API on port 5000        |
| `npm run build` | Production build (vendor-split chunks)         |
| `npm run lint`  | ESLint with `--max-warnings 0` (must be clean) |
| `npm run preview` | Serve the production build                   |

---

## 🗂 Project structure

```
src/
├── components/            # UI, one folder per component
│   ├── Header/            # sticky header: search, currency, theme, auth
│   ├── LocationList/      # home: hero + stay cards
│   ├── Hotels/            # search results + sorting
│   ├── SingleHotel/       # hotel detail + weather + save action
│   ├── Bookmark(Layout)/  # bookmark list & split layout
│   ├── SingleBookmark/    # bookmark detail + weather
│   ├── AddNewBookmark/    # reverse-geocoded form
│   ├── WeatherWidget/     # cross-domain: Open-Meteo card
│   ├── Price/             # cross-domain: FX-aware price
│   ├── CurrencySwitcher/  # cross-domain: currency select
│   ├── ThemeToggle/       # light/dark switch
│   ├── Map/               # Leaflet wrapper (click-to-bookmark)
│   ├── ErrorBoundary/     # top-level crash recovery
│   ├── NotFound/          # 404
│   ├── Loader/ EmptyState/ ProtectedRoute/ Login/
├── config/env.js          # every external URL + storage keys in one place
├── context/               # state: Theme, Auth, Hotels, Bookmarks, Currency
│   ├── *Context.js        # component-free context + hook (fast-refresh safe)
│   └── *Provider.jsx      # provider component
├── hooks/                 # useFetch (abortable), useGeoLocation,
│                          # useOutsideClick, useUrlLocation
├── routes/AppRoutes.jsx   # central route table (incl. 404 catch-all)
├── services/              # all HTTP calls, one module per domain
│   ├── http.js            # axios instance + error normalization
│   ├── hotelService.js  bookmarkService.js
│   ├── weatherService.js  currencyService.js  geocodingService.js
└── utils/                 # imageFallback, ...
```

---

## 🏗 Architecture at a glance

```
components  ──►  context (state)  ──►  services (HTTP)  ──►  http (axios)  ──►  APIs
     │                                                            │
     └── hooks (useFetch/useGeoLocation/...)   config/env (URLs) ◄─┘
```

- **Layers**: UI never calls `axios` directly — it goes through `services/`,
  so endpoints and query shapes exist in exactly one place.
- **State**: five focused contexts (theme, auth, hotels, bookmarks, currency),
  reducers where it pays off, `useCallback`/`useMemo` for stable values.
- **URL as state**: search params and map coordinates live in the URL —
  shareable, back/forward-friendly.
- **Resilience**: abortable fetching (no stale-response races), axios error
  normalization, toast notifications, FX fallback to EUR, image fallback to a
  local gradient, stale-hotel guard in the detail view.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full walkthrough and
[docs/INTEGRATIONS.md](docs/INTEGRATIONS.md) for the external APIs.

---

## 🛠 Tech stack

React 18 · Vite 6 · Tailwind CSS 4 · React Router 6 · Context API +
useReducer · Axios · React Leaflet · react-date-range · date-fns ·
react-hot-toast · React Icons · json-server (dev API)

---

## ✅ Quality gates

```bash
npm run lint    # ESLint, 0 errors / 0 warnings
npm run build   # production build, vendor-split, no size warnings
```

## 🗺 Ideas for the next iteration

- Real backend (Node/Postgres) + JWT auth
- Optimistic bookmark updates & request-level unit tests
- Currency auto-detection from `navigator.language`
- Offline-first PWA shell & image lazy-loading placeholders
- Clustering for large marker sets, keyboard shortcuts in search
