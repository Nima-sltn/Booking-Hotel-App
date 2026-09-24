import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { HiStar } from "react-icons/hi";
import { useHotels } from "../../context/HotelsContext";
import Price from "../Price/Price";
import EmptyState from "../EmptyState/EmptyState";
import { handleImageError } from "../../utils/imageFallback";

const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating-desc", label: "Top rated" },
];

/**
 * Search results list (left panel beside the map) with sorting,
 * highlighted current hotel and an empty state.
 */
function Hotels() {
  const { isLoading, hotels, currentHotel } = useHotels();
  const [sort, setSort] = useState("recommended");

  const sortedHotels = useMemo(() => {
    const list = [...hotels];
    switch (sort) {
      case "price-asc":
        return list.sort((a, b) => a.price - b.price);
      case "price-desc":
        return list.sort((a, b) => b.price - a.price);
      case "rating-desc":
        return list.sort(
          (a, b) =>
            (b.review_scores_rating ?? 0) - (a.review_scores_rating ?? 0),
        );
      default:
        return list;
    }
  }, [hotels, sort]);

  if (isLoading) return <RowSkeletons />;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="page-title">
          Search results{" "}
          <span className="text-sm font-medium text-slate-400">
            ({hotels.length})
          </span>
        </h2>

        <label className="flex items-center gap-2 text-sm text-slate-400">
          Sort
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-indigo-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:ring-indigo-950">
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {sortedHotels.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            title="No stays match your search"
            hint="Try another destination or fewer guests.">
            <Link to="/hotels" className="btn-ghost">
              Reset search
            </Link>
          </EmptyState>
        </div>
      ) : (
        <ul className="mt-4 flex flex-col gap-3">
          {sortedHotels.map((item) => {
            const isActive =
              String(item.id) === String(currentHotel?.id);
            const rating = item.review_scores_rating
              ? (item.review_scores_rating / 10).toFixed(1)
              : null;

            return (
              <li key={item.id}>
                <Link
                  to={`/hotels/${item.id}?lat=${item.latitude}&lng=${item.longitude}`}
                  className={`flex gap-4 rounded-2xl border p-3 transition hover:-translate-y-0.5 hover:shadow-md ${
                    isActive
                      ? "border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-600 dark:border-indigo-500 dark:bg-indigo-950/40 dark:ring-indigo-500"
                      : "border-slate-200 bg-white hover:border-indigo-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-900"
                  }`}>
                  <img
                    src={item.xl_picture_url}
                    alt=""
                    loading="lazy"
                    onError={handleImageError}
                    className="h-24 w-24 shrink-0 rounded-xl object-cover sm:h-28 sm:w-28"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate text-xs font-medium text-slate-400">
                        {item.smart_location}
                      </p>
                      {rating && (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                          <HiStar
                            className="h-3 w-3"
                            aria-hidden="true"
                          />
                          {rating}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-0.5 line-clamp-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {item.name}
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">
                      {item.room_type} · Sleeps {item.accommodates}
                    </p>

                    <Price
                      amount={item.price}
                      perNight
                      className="mt-1.5 block text-base font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function RowSkeletons() {
  return (
    <div className="flex flex-col gap-3" role="status" aria-label="Loading results">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex animate-pulse gap-4 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
          <div className="h-24 w-24 shrink-0 rounded-xl bg-slate-200 sm:h-28 sm:w-28 dark:bg-slate-800" />
          <div className="min-w-0 flex-1 space-y-2.5 py-1">
            <div className="h-3 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-5 w-1/5 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Hotels;
