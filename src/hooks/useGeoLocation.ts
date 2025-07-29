import { useState } from "react";
import { Position } from "../types";

interface UseGeoLocationResult {
  isLoading: boolean;
  position: Position | null;
  error: string | null;
  getPosition: () => void;
}

export default function useGeoLocation(): UseGeoLocationResult {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [position, setPosition] = useState<Position | null>(null);
  const [error, setError] = useState<string | null>(null);

  function getPosition() {
    if (!navigator.geolocation)
      return setError("Your browser does not support geolocation");

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsLoading(false);
      },
      (error) => {
        setError(error.message);
        setIsLoading(false);
      }
    );
  }

  return { isLoading, error, position, getPosition };
}
