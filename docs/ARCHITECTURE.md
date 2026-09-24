# Architecture

StayFinder is organised as a layered SPA: **components render**, **contexts own
state**, **services talk HTTP**, and **config owns every external URL**.

## Layering

```
┌─────────────────────────────────────────────────────────────┐
│ components/   presentational UI, one folder per component  │
│     │ uses hooks (useFetch, useGeoLocation, useOutsideClick)│
│     ▼                                                       │
│ context/      Theme · Auth · Hotels · Bookmarks · Currency  │
│     │ calls                                                │
│     ▼                                                       │
│ services/     hotelService · bookmarkService · weatherService │
│               currencyService · geocodingService            │
│     │ uses                                                 │
│     ▼                                                       │
│ services/http.js   axios instance (baseURL, timeout, errors)│
│     │                                                       │
│     ▼                                                       │
│ config/env.js      VITE_API_URL + third-party endpoints     │
└─────────────────────────────────────────────────────────────┘
```

Rules of thumb:

1. A component never imports `axios`.
2. A service never imports React.
3. URLs and storage keys live only in `config/env.js`.

## State management

| Context        | Owns                                        | Persistence          |
| -------------- | ------------------------------------------- | -------------------- |
| `ThemeContext` | light/dark mode + toggle                    | `stayfinder:theme`   |
| `AuthContext`  | demo user, login/logout (useReducer)        | `stayfinder:user`    |
| `HotelsContext`| search results (URL-driven), current hotel  | URL query string     |
| `BookmarkContext` | bookmarks CRUD (useReducer, service-backed) | JSON Server         |
| `CurrencyContext` | selected currency, live rates, `formatPrice` | `stayfinder:currency` |

- Every provider file is paired with a **component-free `*Context.js`** module
  holding the context object and hook — this keeps React Fast Refresh working
  (`react-refresh/only-export-components` stays silent) and makes the hook
  throw a clear error when used outside its provider.
- Provider order in `App.jsx`: `Theme → Auth → BookmarkList → Hotels → Currency`.

## Routing (`src/routes/AppRoutes.jsx`)

| Path             | Page                    | Guarded |
| ---------------- | ----------------------- | ------- |
| `/`              | LocationList (home)     | no      |
| `/login`         | Login                   | no      |
| `/hotels`        | Hotels (list + map)     | no      |
| `/hotels/:id`    | SingleHotel (list+map)  | no      |
| `/bookmark`      | Bookmark (list + map)   | **yes** |
| `/bookmark/:id`  | SingleBookmark          | **yes** |
| `/bookmark/add`  | AddNewBookmark          | **yes** |
| `*`              | NotFound (404)          | no      |

`ProtectedRoute` renders `<Navigate state={{from}}>` instead of the old
effect-based redirect: no flash of wrong page, and `Login` sends the user back
to where they started after a successful sign-in.

## URL as state

- Search: `/hotels?destination=...&date=...&options=...` — built with
  `createSearchParams`, read by `HotelsProvider`.
- Map click: `/bookmark/add?lat=...&lng=...` — read by `useUrlLocation`,
  consumed by the geocoding form.

## Error & resilience strategy

| Failure                      | Behaviour                                        |
| ---------------------------- | ------------------------------------------------ |
| API returns 4xx/5xx/timeout  | `http.js` interceptor normalizes `error.message` |
| Context/service call throws  | `toast.error(...)` + `rejected` reducer action   |
| Render crash                 | `ErrorBoundary` → friendly card, "Try again"    |
| Unknown URL                  | `NotFound` catch-all route                       |
| Stale fetch response         | `useFetch` aborts superseded requests            |
| FX rates unreachable         | prices stay in EUR (no mislabeled amounts)       |
| Broken image URL             | local gradient SVG via `onError`                 |
| Detail loaded for wrong id   | guard `String(data.id) === String(id)`           |

## Performance

- **Code splitting** (`vite.config.js` `manualChunks`): `react-core`, `maps`
  (leaflet), `dates` (date-range), `vendor`, small app entry.
- Images: local SVG covers (no third-party CDN), `loading="lazy"`,
  CSS `line-clamp` for long titles.
- Providers memoize their value (`useMemo` + `useCallback`) so consumers do
  not re-render needlessly.

## Component conventions

- One folder per component; default export = component; PropTypes documented.
- Shared visual language via `@layer components` classes in `index.css`:
  `btn-primary`, `btn-ghost`, `form-label`, `form-input`, `panel`,
  `page-title`, `section-label`, `back-link`.
- Accessibility: labels on every input, `aria-label` on icon buttons,
  `role="status"` on loaders, valid HTML (row links and action buttons are
  siblings, never nested).
