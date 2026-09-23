import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

/**
 * Fetch JSON from `${url}?${query}` whenever the URL or query changes.
 * In-flight requests are aborted on unmount / query change so stale
 * responses can never overwrite fresh data (race-condition free).
 *
 * @param {string} url absolute endpoint URL
 * @param {string} [query=""] query string, e.g. `q=amsterdam&accommodates_gte=1`
 * @returns {{ data: any[], isLoading: boolean, error: string|null }}
 */
export default function useFetch(url, query = "") {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        setIsLoading(true);
        setError(null);
        const { data } = await axios.get(`${url}?${query}`, {
          signal: controller.signal,
        });
        setData(data);
        setIsLoading(false);
      } catch (err) {
        if (axios.isCancel(err)) return; // superseded request, ignore
        setData([]);
        setError(err?.message ?? "Something went wrong");
        toast.error(err?.message ?? "Something went wrong");
        setIsLoading(false);
      }
    })();

    return () => controller.abort();
  }, [url, query]);

  return { isLoading, data, error };
}
