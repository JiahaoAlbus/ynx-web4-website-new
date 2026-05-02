import { useState, useEffect } from "react";

export interface ServiceStatus {
  status: "online" | "offline" | "degraded";
  data?: any;
  error?: string;
  code?: number;
}

export type NetworkStatus = Record<string, ServiceStatus>;

export function useNetworkStatus() {
  const [status, setStatus] = useState<NetworkStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      const fetchUrl = "/api/network/status";
      console.log(`[StatusHook] Fetching from ${fetchUrl}...`);
      const response = await fetch(fetchUrl, {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        const text = await response.text().catch(() => "N/A");
        console.error(`[StatusHook] Server error: ${response.status} ${response.statusText}`, text.substring(0, 100));
        throw new Error(`Status API unavailable (${response.status})`);
      }
      
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error(`[StatusHook] Invalid content type: ${contentType}`);
        throw new Error("Status API returned invalid format. Check server routing.");
      }

      const data = await response.json();
      setStatus(data);
      setError(null);
    } catch (err: any) {
      console.error("[StatusHook] Fetch failure:", {
        message: err.message,
        name: err.name,
        stack: err.stack
      });
      
      let displayError = err.message;
      if (err.message === "Failed to fetch") {
        displayError = "Connection failed. The dashboard server might be restarting or unreachable.";
      }
      
      setError(displayError);
      setStatus(null); 
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
