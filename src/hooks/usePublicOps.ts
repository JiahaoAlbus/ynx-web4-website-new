import { useCallback, useEffect, useState } from "react";
import { getPublicOpsSnapshot, type PublicOpsSnapshot } from "../lib/publicOps";

export function usePublicOps() {
  const [snapshot, setSnapshot] = useState<PublicOpsSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const data = await getPublicOpsSnapshot();
      setSnapshot(data);
      setError(data.errors.length > 0 ? data.errors.join("; ") : null);
    } catch (err) {
      const reason = err instanceof Error ? err.message : "unknown_error";
      setError(reason);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => {
      void refresh();
    }, 45000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  return { snapshot, loading, error, refresh };
}
