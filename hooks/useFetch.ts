import { useEffect, useState } from "react";


export const useFetch = <T>(fetchFunc: () => Promise<T>, autoFetch = true) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchFunc();
      setData(result);
      return result;
    } catch (error) {
      setError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setLoading(false);
    }
  }

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  }

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [])

  return { data, loading, error, refetch: fetchData, reset };
}