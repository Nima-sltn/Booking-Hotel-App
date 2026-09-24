import { useState } from "react";

/**
 * Geolocation wrapper around `navigator.geolocation`.
 * @returns {{
 *   isLoading: boolean,
 *   error: string|null,
 *   position: { lat?: number, lng?: number },
 *   getPosition: () => void,
 * }}
 */
export default function useGeoLocation() {
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState({});
  const [error, setError] = useState(null);

  function getPosition() {
    if (!navigator.geolocation) {
      setError("Your browser does not support geolocation");
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsLoading(false);
      },
      (err) => {
        setError(err.message);
        setIsLoading(false);
      },
    );
  }

  return { isLoading, error, position, getPosition };
}
