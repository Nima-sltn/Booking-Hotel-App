import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface UseFetchResult<T> {
  isLoading: boolean;
  data: T[];
}

export default function useFetch<T = any>(url: string, query: string = ""): UseFetchResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`${url}?${query}`);
        setData(data);
      } catch (err: any) {
        setData([]);
        toast.error(err?.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [query, url]);

  return { isLoading, data };
}
