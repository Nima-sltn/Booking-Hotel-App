import { useSearchParams } from "react-router-dom";

/**
 * Read the `lat`/`lng` pair from the current URL query string
 * (used by the map click -> add bookmark flow).
 * @returns {[string|null, string|null]}
 */
export default function useUrlLocation() {
  const [searchParams] = useSearchParams();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  return [lat, lng];
}
