import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { HiChevronLeft, HiLocationMarker, HiStar } from "react-icons/hi";
import { useHotels } from "../../context/HotelsContext";
import Loader from "../Loader/Loader";
import Price from "../Price/Price";
import WeatherWidget from "../WeatherWidget/WeatherWidget";
import { handleImageError } from "../../utils/imageFallback";

/**
 * Hotel detail (left panel beside the map): hero image, key facts,
 * price + save action, live weather, description, amenities and host.
 */
function SingleHotel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentHotel: data, getHotel, isLoadingCurrHotel } = useHotels();

  useEffect(() => {
    getHotel(id);
  }, [id, getHotel]);

  // Guard against showing a stale hotel from a previous navigation.
  if (isLoadingCurrHotel || !data || String(data.id) !== String(id)) {
    return <Loader label="Loading stay…" />;
  }

  const rating = data.review_scores_rating
    ? (data.review_scores_rating / 10).toFixed(1)
    : null;
  const amenities = Array.isArray(data.amenities) ? data.amenities : [];

  return (
    <article className="space-y-5">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="back-link">
        <HiChevronLeft className="h-4 w-4" aria-hidden="true" />
        Back to results
      </button>

      {/* Hero image */}
      <div className="relative overflow-hidden rounded-2xl">
        <img
          src={data.xl_picture_url}
          alt={data.name}
          onError={handleImageError}
          className="h-56 w-full object-cover sm:h-64"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent p-4 pt-10">
          <p className="text-xs font-medium uppercase tracking-wider text-white/80">
            {[data.room_type, data.property_type].filter(Boolean).join(" · ")}
          </p>
          <h1 className="mt-0.5 text-xl font-bold leading-snug text-white">
            {data.name}
          </h1>
        </div>
        {rating && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-slate-800 shadow">
            <HiStar className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
            {rating}
          </span>
        )}
      </div>

      {/* Quick facts */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-slate-500 dark:text-slate-400">
        <span className="inline-flex items-center gap-1">
          <HiLocationMarker
            className="h-4 w-4 shrink-0 text-rose-500"
            aria-hidden="true"
          />
          {data.smart_location}
        </span>
        {Number(data.number_of_reviews) > 0 && (
          <span>{data.number_of_reviews} reviews</span>
        )}
        <span>Sleeps {data.accommodates}</span>
        {data.bedrooms != null && (
          <span>
            {data.bedrooms} bedroom{Number(data.bedrooms) > 1 ? "s" : ""}
            {data.beds != null && ` · ${data.beds} bed`}
          </span>
        )}
      </div>

      {/* Price + save action */}
      <div className="panel flex flex-wrap items-center justify-between gap-4 p-4">
        <div>
          <Price
            amount={data.price}
            className="text-2xl font-extrabold text-slate-900 dark:text-white"
          />
          <p className="text-xs text-slate-400">per night, all-in</p>
        </div>
        <button
          type="button"
          onClick={() =>
            navigate(
              `/bookmark/add?lat=${data.latitude}&lng=${data.longitude}`,
            )
          }
          className="btn-primary">
          Save to bookmarks
        </button>
      </div>

      {/* Cross-domain: live weather for this coordinate */}
      <WeatherWidget lat={data.latitude} lng={data.longitude} />

      {(data.summary || data.description) && (
        <section>
          <h2 className="section-label">About this place</h2>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {data.summary || data.description}
          </p>
        </section>
      )}

      {amenities.length > 0 && (
        <section>
          <h2 className="section-label">What this place offers</h2>
          <ul className="flex flex-wrap gap-2">
            {amenities.slice(0, 10).map((amenity) => (
              <li
                key={amenity}
                className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {amenity}
              </li>
            ))}
            {amenities.length > 10 && (
              <li className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                +{amenities.length - 10} more
              </li>
            )}
          </ul>
        </section>
      )}

      {data.host_name && (
        <section className="panel flex items-center gap-3 p-4">
          {data.host_picture_url ? (
            <img
              src={data.host_picture_url}
              alt=""
              className="h-10 w-10 shrink-0 rounded-full object-cover"
              loading="lazy"
              onError={handleImageError}
            />
          ) : (
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-indigo-100 font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              {data.host_name.charAt(0).toUpperCase()}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
              Hosted by {data.host_name}
            </p>
            {data.host_since && (
              <p className="truncate text-xs text-slate-400">
                Hosting since {format(new Date(data.host_since), "yyyy")}
              </p>
            )}
          </div>
        </section>
      )}
    </article>
  );
}

export default SingleHotel;
