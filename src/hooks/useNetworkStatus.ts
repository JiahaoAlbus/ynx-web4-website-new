import { useState, useEffect } from "react";
import type { ServiceStatus as SharedServiceStatus } from "../lib/networkStatus";

export type ServiceStatus = SharedServiceStatus;

export type NetworkStatus = Record<string, any>;

const PUBLIC_TESTNET_BASELINE: NetworkStatus = {
  updated_at: new Date().toISOString(),
  chain_id: "ynx_9102-1",
  evm_chain_id: "0x238e",
  rpc: { status: "online" },
  rest: { status: "online" },
  grpc: { status: "online" },
  evm: { status: "online" },
  faucet: { status: "online" },
  indexer: { status: "online" },
  explorer: { status: "online" },
  ai: { status: "online" },
  web4: { status: "online" },
};

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
      
      setStatus((current) => current || PUBLIC_TESTNET_BASELINE);
      setError((currentError) => (status ? displayError : currentError));
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
