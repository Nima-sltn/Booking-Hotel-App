import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import ReactCountryFlag from "react-country-flag";
import { HiChevronLeft, HiLocationMarker } from "react-icons/hi";
import { useBookmark } from "../../context/BookmarkContext";
import Loader from "../Loader/Loader";
import WeatherWidget from "../WeatherWidget/WeatherWidget";

/**
 * Single bookmark detail: location facts + live weather for the spot.
 */
function SingleBookmark() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getBookmark, isLoading, currentBookmark } = useBookmark();

  useEffect(() => {
    getBookmark(id);
  }, [id, getBookmark]);

  if (isLoading || !currentBookmark) {
    return <Loader label="Loading bookmark…" />;
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="back-link">
        <HiChevronLeft className="h-4 w-4" aria-hidden="true" />
        Back
      </button>

      <section className="panel p-5">
        <div className="flex items-center gap-3">
          <ReactCountryFlag
            svg
            countryCode={currentBookmark.countryCode}
            className="shrink-0 rounded-md text-4xl"
            aria-hidden="true"
          />
          <div className="min-w-0">
            <h2 className="truncate text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              {currentBookmark.cityName}
            </h2>
            <p className="flex items-center gap-1 truncate text-sm text-slate-400">
              <HiLocationMarker
                className="h-4 w-4 shrink-0 text-rose-500"
                aria-hidden="true"
              />
              {currentBookmark.country}
            </p>
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-3">
          <Fact
            label="Latitude"
            value={Number(currentBookmark.latitude).toFixed(4)}
          />
          <Fact
            label="Longitude"
            value={Number(currentBookmark.longitude).toFixed(4)}
          />
        </dl>
      </section>

      <WeatherWidget
        lat={currentBookmark.latitude}
        lng={currentBookmark.longitude}
      />
    </div>
  );
}

function Fact({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
      <dt className="text-xs text-slate-400">{label}</dt>
      <dd className="text-sm font-semibold tabular-nums text-slate-800 dark:text-slate-100">
        {value}
      </dd>
    </div>
  );
}

Fact.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default SingleBookmark;
