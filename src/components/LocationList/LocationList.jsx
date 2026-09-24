import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { HiArrowRight, HiLocationMarker, HiStar } from "react-icons/hi";
import useFetch from "../../hooks/useFetch";
import { API_BASE_URL } from "../../config/env";
import Price from "../Price/Price";
import EmptyState from "../EmptyState/EmptyState";
import { handleImageError } from "../../utils/imageFallback";

/**
 * Home page: hero + grid of every stay in the dataset.
 * Each card links to the hotel detail (list + map side by side).
 */
function LocationList() {
  const { data, isLoading } = useFetch(`${API_BASE_URL}/hotels`, "");

  const cities = new Set(data.map((h) => h.smart_location)).size;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-rose-500 px-6 py-12 text-white sm:px-10 sm:py-16">
        <span
          aria-hidden="true"
          className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl"
        />
        <span
          aria-hidden="true"
          className="absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-rose-500/40 blur-2xl"
        />

        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
            <HiStar className="h-3.5 w-3.5 text-amber-300" aria-hidden="true" />
            Live weather &amp; prices in your currency
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
            Find your next stay
          </h1>
          <p className="mt-3 max-w-xl text-sm text-white/80 sm:text-base">
            Search homes and hotels, bookmark the destinations you love and
            explore them side by side on an interactive map.
          </p>

          {!isLoading && (
            <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
              <Stat value={data.length} label="stays" />
              <Stat value={cities} label="destinations" />
              <Stat value="Live" label="weather & FX rates" />
            </dl>
          )}
        </div>
      </section>

      {/* All stays */}
      <section className="mt-10">
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <h2 className="page-title">All stays</h2>
          {!isLoading && (
            <span className="text-sm text-slate-400">{data.length} places</span>
          )}
        </div>

        {isLoading ? (
          <CardSkeletons />
        ) : data.length === 0 ? (
          <EmptyState
            title="No stays found"
            hint="The local API returned no hotels. Is the json-server running?">
            <Link to="/hotels" className="btn-primary">
              Browse anyway
            </Link>
          </EmptyState>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.map((item) => {
              const rating = item.review_scores_rating
                ? (item.review_scores_rating / 10).toFixed(1)
                : null;

              return (
                <Link
                  key={item.id}
                  to={`/hotels/${item.id}?lat=${item.latitude}&lng=${item.longitude}`}
                  className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-900">
                  <div className="relative h-48 overflow-hidden sm:h-52">
                    <img
                      src={item.xl_picture_url}
                      alt={item.name}
                      loading="lazy"
                      onError={handleImageError}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    {rating && (
                      <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-xs font-bold text-slate-800 shadow-sm">
                        <HiStar
                          className="h-3.5 w-3.5 text-amber-400"
                          aria-hidden="true"
                        />
                        {rating}
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <p className="flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                      <HiLocationMarker
                        className="h-3.5 w-3.5 shrink-0"
                        aria-hidden="true"
                      />
                      <span className="truncate">{item.smart_location}</span>
                    </p>
                    <h3 className="mt-1 line-clamp-1 text-sm font-semibold text-slate-800 transition group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-indigo-400">
                      {item.name}
                    </h3>

                    <div className="mt-3 flex items-center justify-between gap-2">
                      <Price
                        amount={item.price}
                        perNight
                        className="text-lg font-bold text-slate-900 dark:text-white"
                      />
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-500 transition group-hover:bg-indigo-600 group-hover:text-white dark:bg-slate-800">
                        <HiArrowRight className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <dd className="text-2xl font-extrabold">{value}</dd>
      <dt className="mt-0.5 text-xs uppercase tracking-wider text-white/70">
        {label}
      </dt>
    </div>
  );
}

Stat.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  label: PropTypes.string.isRequired,
};

function CardSkeletons() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="h-48 bg-slate-200 sm:h-52 dark:bg-slate-800" />
          <div className="space-y-2.5 p-4">
            <div className="h-3 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-5 w-1/4 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default LocationList;
