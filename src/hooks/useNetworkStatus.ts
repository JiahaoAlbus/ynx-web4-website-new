import { useState, useEffect } from "react";
import type { ServiceStatus as SharedServiceStatus } from "../lib/networkStatus";

export type ServiceStatus = SharedServiceStatus;

export type NetworkStatus = Record<string, any>;

export function useNetworkStatus() {
  const [status, setStatus] = useState<NetworkStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      const fetchUrl = "/api/network/status";
      const response = await fetch(fetchUrl, {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Status API unavailable (${response.status})`);
      }
      
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Status API returned invalid format. Check server routing.");
      }

      const data = await response.json();
      setStatus(data);
      setError(null);
    } catch (err: any) {
      let displayError = err.message;
      if (err.message === "Failed to fetch") {
        displayError = "Connection failed. The dashboard server might be restarting or unreachable.";
      }
      
      setError(displayError);
      setStatus((current) => current); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  return { status, loading, error, refetch: fetchStatus };
}
