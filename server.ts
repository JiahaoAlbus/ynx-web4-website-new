import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { getNetworkStatus } from "./src/lib/networkStatus";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Logger middleware
  app.use((req, res, next) => {
    console.log(`[Server] ${req.method} ${req.url}`);
    next();
  });

  // API to proxy status checks (avoiding CORS and providing server-side aggregation)
  app.get("/api/network/status", async (req, res) => {
    console.log(`[API] Received status request from ${req.ip}`);

    try {
      const status = await getNetworkStatus();
      res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      res.json(status);
    } catch (err: any) {
      console.error(`[API] Fatal error in status route:`, err);
      res.status(500).json({ error: "Internal Server Error", message: err.message });
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
