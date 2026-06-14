import { useState, useEffect } from "react";
import type { ServiceStatus as SharedServiceStatus } from "../lib/networkStatus";

export type ServiceStatus = SharedServiceStatus;

export type NetworkStatus = Record<string, any>;

const PUBLIC_TESTNET_BASELINE: NetworkStatus = {
  updated_at: new Date().toISOString(),
  chain_id: "ynx_9102-1",
  evm_chain_id: "0x238e",
  source: "static-fallback",
  summary: "degraded",
  rpc: { status: "degraded", error: "status_api_unavailable" },
  rest: { status: "degraded", error: "status_api_unavailable" },
  grpc: { status: "degraded", error: "status_api_unavailable" },
  evm: { status: "degraded", error: "status_api_unavailable" },
  faucet: { status: "degraded", error: "status_api_unavailable" },
  indexer: { status: "degraded", error: "status_api_unavailable" },
  explorer: { status: "degraded", error: "status_api_unavailable" },
  ai: { status: "degraded", error: "status_api_unavailable" },
  web4: { status: "degraded", error: "status_api_unavailable" },
};

const STATUS_POLL_INTERVAL_MS = 60_000;
const STATUS_FETCH_TIMEOUT_MS = 4_500;

export function useNetworkStatus() {
  const [status, setStatus] = useState<NetworkStatus | null>(PUBLIC_TESTNET_BASELINE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), STATUS_FETCH_TIMEOUT_MS);

    setLoading(true);

    try {
      const fetchUrl = "/api/network/status";
      const response = await fetch(fetchUrl, {
        signal: controller.signal,
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
      let displayError = err.name === "AbortError" ? "Status API timed out" : err.message;
      if (err.message === "Failed to fetch") {
        displayError = "Connection failed. The dashboard server might be restarting or unreachable.";
      }
      
      setStatus((current) => current || PUBLIC_TESTNET_BASELINE);
      setError(displayError);
    } finally {
      window.clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchStatus();
    const interval = setInterval(fetchStatus, STATUS_POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return { status, loading, error, refetch: fetchStatus };
}
