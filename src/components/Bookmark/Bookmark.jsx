import ReactCountryFlag from "react-country-flag";
import { Link } from "react-router-dom";
import { HiBookmark, HiTrash } from "react-icons/hi";
import { useBookmark } from "../../context/BookmarkContext";
import Loader from "../Loader/Loader";
import EmptyState from "../EmptyState/EmptyState";

/**
 * List of saved bookmarks (left panel beside the map).
 * Row navigation and delete are separate elements for valid HTML/a11y.
 */
function Bookmark() {
  const { isLoading, deleteBookmark, bookmarks, currentBookmark } =
    useBookmark();

  const handleDelete = async (event, id) => {
    event.preventDefault();
    event.stopPropagation();
    await deleteBookmark(id);
  };

  if (isLoading) return <Loader label="Loading bookmarks…" />;

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h2 className="page-title">Bookmarks</h2>
        {!isLoading && bookmarks.length > 0 && (
          <span className="text-sm text-slate-400">
            {bookmarks.length} saved
          </span>
        )}
      </div>

      {bookmarks.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            icon={
              <HiBookmark className="h-6 w-6" aria-hidden="true" />
            }
            title="No bookmarks yet"
            hint="Click any spot on the map to save a destination here.">
            <Link to="/hotels" className="btn-ghost">
              Explore stays
            </Link>
          </EmptyState>
        </div>
      ) : (
        <ul className="mt-4 flex flex-col gap-2.5">
          {bookmarks.map((item) => {
            const isActive =
              String(item.id) === String(currentBookmark?.id);

            return (
              <li key={item.id}>
                <div
                  className={`group flex items-center justify-between gap-3 rounded-2xl border p-3.5 transition ${
                    isActive
                      ? "border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-600 dark:border-indigo-500 dark:bg-indigo-950/40 dark:ring-indigo-500"
                      : "border-slate-200 bg-white hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-800"
                  }`}>
                  <Link
                    to={`${item.id}?lat=${item.latitude}&lng=${item.longitude}`}
                    className="flex min-w-0 flex-1 items-center gap-3">
                    <ReactCountryFlag
                      svg
                      countryCode={item.countryCode}
                      className="shrink-0 rounded text-2xl"
                      aria-hidden="true"
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {item.cityName}
                      </span>
                      <span className="block truncate text-xs text-slate-400">
                        {item.country}
                      </span>
                    </span>
                  </Link>

                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, item.id)}
                    aria-label={`Delete bookmark for ${item.cityName}`}
                    title="Delete bookmark"
                    className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-500 focus-visible:ring-2 focus-visible:ring-rose-400 lg:opacity-0 lg:group-hover:opacity-100 dark:hover:bg-rose-950/40">
                    <HiTrash className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default Bookmark;
