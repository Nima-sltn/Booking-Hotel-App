import { useCallback, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { HotelContext } from "./HotelsContext";
import useFetch from "../hooks/useFetch";
import { API_BASE_URL } from "../config/env";
import { getHotelById } from "../services/hotelService";

/**
 * Hotel search state: list filtered by URL search params + the currently
 * opened hotel detail. Query state lives in the URL so searches are
 * shareable/bookmarkable.
 * @param {{ children: import("react").ReactNode }} props
 */
export default function HotelsProvider({ children }) {
  const [currentHotel, setCurrentHotel] = useState(null);
  const [isLoadingCurrHotel, setIsLoadingCurrHotel] = useState(false);
  const [searchParams] = useSearchParams();

  const destination = searchParams.get("destination") ?? "";
  let room = 1;
  try {
    room = JSON.parse(searchParams.get("options"))?.room ?? 1;
  } catch {
    /* malformed params -> fall back to 1 room */
  }

  const query = `q=${encodeURIComponent(destination)}&accommodates_gte=${room}`;

  const { isLoading, data: hotels, error } = useFetch(
    `${API_BASE_URL}/hotels`,
    query,
  );

  /** Load a single hotel detail by id. */
  const getHotel = useCallback(async (id) => {
    setIsLoadingCurrHotel(true);
    try {
      const hotel = await getHotelById(id);
      setCurrentHotel(hotel);
      return hotel;
    } catch (err) {
      toast.error(err.message);
      setCurrentHotel(null);
      return null;
    } finally {
      setIsLoadingCurrHotel(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      isLoading,
      error,
      hotels: hotels ?? [],
      currentHotel,
      getHotel,
      isLoadingCurrHotel,
    }),
    [isLoading, error, hotels, currentHotel, getHotel, isLoadingCurrHotel],
  );

  return (
    <HotelContext.Provider value={value}>{children}</HotelContext.Provider>
  );
}

HotelsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
