import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ReactCountryFlag from "react-country-flag";
import { HiChevronLeft } from "react-icons/hi";
import useUrlLocation from "../../hooks/useUrlLocation";
import { useBookmark } from "../../context/BookmarkContext";
import { reverseGeocode } from "../../services/geocodingService";
import Loader from "../Loader/Loader";

/**
 * Reverse-geocodes the map click (lat/lng in the URL) into city/country,
 * lets the user correct it, then persists the bookmark.
 */
function AddNewBookmark() {
  const navigate = useNavigate();
  const [lat, lng] = useUrlLocation();
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [isLoadingGeoCoding, setIsLoadingGeoCoding] = useState(false);
  const { createBookmark } = useBookmark();

  useEffect(() => {
    if (!lat || !lng) return undefined;
    let cancelled = false;

    async function fetchLocationData() {
      setIsLoadingGeoCoding(true);
      try {
        const place = await reverseGeocode(lat, lng);
        if (cancelled) return;

        setCityName(place.cityName);
        setCountry(place.country);
        setCountryCode(place.countryCode);
      } catch (error) {
        if (cancelled) return;
        toast.error(error.message, { style: { border: "1px solid red" } });
        setCountry("");
        setCityName("");
        setCountryCode("");
      } finally {
        if (!cancelled) setIsLoadingGeoCoding(false);
      }
    }

    fetchLocationData();
    return () => {
      cancelled = true;
    };
  }, [lat, lng]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!cityName || !country) return;

    const newBookmark = {
      cityName,
      country,
      countryCode,
      latitude: lat,
      longitude: lng,
      host_location: `${cityName} ${country}`,
    };

    const created = await createBookmark(newBookmark);
    if (created) navigate("/bookmark");
  };

  if (isLoadingGeoCoding) return <Loader label="Looking up location…" />;

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
        <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
          Add new bookmark
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          We looked up the spot you clicked — adjust it if needed.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="cityName" className="form-label">
              City
            </label>
            <input
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
              type="text"
              name="cityName"
              id="cityName"
              placeholder="e.g. Amsterdam"
              className="form-input"
            />
          </div>

          <div>
            <label htmlFor="country" className="form-label">
              Country
            </label>
            <div className="relative">
              <input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                type="text"
                name="country"
                id="country"
                placeholder="e.g. Netherlands"
                className="form-input pr-12"
              />
              {countryCode && (
                <ReactCountryFlag
                  svg
                  countryCode={countryCode}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded text-xl"
                  aria-hidden="true"
                />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-ghost">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!cityName || !country}
              className="btn-primary">
              Add bookmark
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default AddNewBookmark;
