import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { getNetworkStatus } from "./src/lib/networkStatus";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;
  const AI_GATEWAY_CHAT_URL = "https://ai.ynxweb4.com/ai/chat";

  // Logger middleware
  app.use((req, res, next) => {
    console.log(`[Server] ${req.method} ${req.url}`);
    next();
  });
  app.use(express.json({ limit: "1mb" }));

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

  app.post("/api/ai/chat/stream", async (req, res) => {
    const requestId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";

    if (!message) {
      res.status(400).json({ ok: false, error: "message_required" });
      return;
    }

    const abortController = new AbortController();
    req.on("close", () => abortController.abort());

    res.setHeader("Content-Type", "application/x-ndjson; charset=utf-8");
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    const writeEvent = (payload: Record<string, unknown>) => {
      res.write(`${JSON.stringify(payload)}\n`);
    };

    try {
      writeEvent({ type: "meta", requestId, status: "started" });

      const upstream = await fetch(AI_GATEWAY_CHAT_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message }),
        signal: abortController.signal,
      });

      if (!upstream.ok) {
        const text = await upstream.text();
        writeEvent({
          type: "error",
          requestId,
          status: upstream.status,
          message: text || `upstream_${upstream.status}`,
        });
        res.end();
        return;
      }

      const json = (await upstream.json()) as { answer?: string; mode?: string; model?: string; llm_error?: string };
      const answer = typeof json.answer === "string" ? json.answer : "";
      const tokens = answer.match(/\S+\s*/g) || [];

      writeEvent({
        type: "meta",
        requestId,
        mode: json.mode || json.model || "-",
        llm_error: json.llm_error || null,
      });

      for (let index = 0; index < tokens.length; index += 1) {
        if (abortController.signal.aborted) break;
        writeEvent({
          type: "delta",
          requestId,
          delta: tokens[index],
          done: false,
        });
        await new Promise((resolve) => setTimeout(resolve, 14));
      }

      writeEvent({
        type: "done",
        requestId,
        done: true,
      });
      res.end();
    } catch (err: any) {
      if (!res.writableEnded) {
        writeEvent({
          type: "error",
          requestId,
          message: err?.name === "AbortError" ? "stream_aborted" : err?.message || "stream_failed",
        });
        res.end();
      }
    }
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
