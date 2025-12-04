import { useCallback, useEffect, useRef, useState } from "react";

export const useFetch = <T>(
  fetchFunc: (signal?: AbortSignal) => Promise<T>, 
  autoFetch = true,
  deps: React.DependencyList = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunc(signal);

      if (!signal.aborted) {
        setData(result);
      }
      return result;
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        setError(error instanceof Error ? error : new Error(String(error)));
        throw error;
      }
      return undefined;
    } finally {
      if (!abortControllerRef.current?.signal.aborted) {
        setLoading(false);
      }
    }
  }, [fetchFunc]);

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [autoFetch, fetchData, ...deps]);

  return { data, loading, error, refetch: fetchData, reset };
}