import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Logger middleware
  app.use((req, res, next) => {
    console.log(`[Server] ${req.method} ${req.url}`);
    next();
  });

  // Network Endpoints to check
  const ENDPOINTS: Record<string, { url: string; method?: string; body?: any; check: (data: any) => "online" | "degraded" | "offline" }> = {
    rpc: {
      url: "https://rpc.ynxweb4.com/status",
      check: (data) => {
        const result = data?.result;
        if (result?.node_info?.network === "ynx_9102-1") {
          return result?.sync_info?.catching_up ? "degraded" : "online";
        }
        return "offline";
      }
    },
    evm: {
      url: "https://evm.ynxweb4.com",
      method: "POST",
      body: { jsonrpc: "2.0", id: 1, method: "eth_chainId", params: [] },
      check: (data) => (data?.result === "0x238e" ? "online" : "offline")
    },
    rest: {
      url: "https://rest.ynxweb4.com/cosmos/base/tendermint/v1beta1/node_info",
      check: (data) => (data?.default_node_info?.network === "ynx_9102-1" ? "online" : "offline")
    },
    grpc: {
      url: "https://grpc.ynxweb4.com",
      check: (data) => "online" 
    },
    faucet: {
      url: "https://faucet.ynxweb4.com/health",
      check: (data) => (data?.ok === true && data?.chain_id === "ynx_9102-1" ? "online" : "offline")
    },
    indexer: {
      url: "https://indexer.ynxweb4.com/health",
      check: (data) => {
        if (data?.ok === true && data?.chain_id === "ynx_9102-1") {
          const lag = (data.latest_seen || 0) - (data.last_indexed || 0);
          return lag > 10 ? "degraded" : "online";
        }
        return "offline";
      }
    },
    ai: {
      url: "https://ai.ynxweb4.com/health",
      check: (data) => (data?.ok === true && data?.service === "ynx-ai-gateway" ? "online" : "offline")
    },
    web4: {
      url: "https://web4.ynxweb4.com/health",
      check: (data) => (data?.ok === true && data?.service === "ynx-web4-hub" ? "online" : "offline")
    },
  };

  // API to proxy status checks (avoiding CORS and providing server-side aggregation)
  app.get("/api/network/status", async (req, res) => {
    console.log(`[API] Received status request from ${req.ip}`);
    
    const results: Record<string, any> = {
      updated_at: new Date().toISOString(),
      chain_id: "ynx_9102-1",
      evm_chain_id: "0x238e"
    };
    
    // Set a timeout for the entire request
    const requestTimeout = setTimeout(() => {
      if (!res.headersSent) {
        console.warn(`[API] Status request timed out, sending partial results`);
        res.json({ ...results, warning: "Timeout reached" });
      }
    }, 12000);

    const checkService = async (key: string, config: typeof ENDPOINTS[string]) => {
      const start = Date.now();
      try {
        console.log(`[API] Checking ${key}...`);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000); // reduced to 6s
        
        const fetchOptions: RequestInit = {
          method: config.method || "GET",
          signal: controller.signal,
          headers: { 
            'Accept': 'application/json',
            ...(config.body ? { 'Content-Type': 'application/json' } : {})
          }
        };

        if (config.body) {
          fetchOptions.body = JSON.stringify(config.body);
        }

        const response = await fetch(config.url, fetchOptions);
        clearTimeout(timeoutId);
        
        const latency_ms = Date.now() - start;

        if (response.ok || (key === 'grpc' && response.status === 404)) {
          const text = await response.text();
          let data = null;
          try {
            data = text ? JSON.parse(text) : null;
          } catch (e) {
            // Not JSON
          }
          
          const status = config.check(data);
          results[key] = { 
            status, 
            latency_ms,
            data: status === "online" || status === "degraded" ? data : undefined 
          };
        } else {
          results[key] = { 
            status: "offline", 
            code: response.status, 
            latency_ms,
            error: `HTTP ${response.status}`
          };
        }
      } catch (error: any) {
        const latency_ms = Date.now() - start;
        results[key] = { 
          status: "offline", 
          latency_ms,
          error: error.name === 'AbortError' ? 'timeout' : 'unreachable'
        };
      }
    };

    try {
      const checks = Object.entries(ENDPOINTS).map(([key, config]) => checkService(key, config));
      await Promise.allSettled(checks);
      
      clearTimeout(requestTimeout);
      if (!res.headersSent) {
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.json(results);
      }
    } catch (err: any) {
      console.error(`[API] Fatal error in status route:`, err);
      clearTimeout(requestTimeout);
      if (!res.headersSent) {
        res.status(500).json({ error: "Internal Server Error", message: err.message });
      }
    }
  });

  // Simple ping endpoint for health checks
  app.get("/api/ping", (req, res) => {
    console.log(`[API] Received ping`);
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`YNX Dashboard Server running on http://localhost:${PORT}`);
  });
}

startServer();
