import { useEffect, useMemo, useState } from "react";
import { Activity, AlertTriangle, CheckCircle2, ExternalLink, RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

type BridgeHealth = {
  ok: boolean;
  onchain?: {
    enabled: boolean;
    ready: boolean;
    watcher_poll_ms: number;
    last_error: string;
  };
  stats?: {
    routes: number;
    deposits: number;
    withdrawals: number;
    minted_deposits: number;
    watcher_routes: number;
  };
};

type WatcherResponse = {
  ok: boolean;
  items: Record<string, {
    last_scanned_block?: number;
    last_scan_at?: string;
    last_error?: string;
    events_seen?: number;
    deposits_minted?: number;
  }>;
};

type RouteCheckResponse = {
  ok: boolean;
  items: Array<{ routeId: string; ok: boolean; expectedWrappedToken?: string; mappedWrappedToken?: string; error?: string }>;
};

type Gate = {
  label: string;
  ok: boolean;
  detail: string;
};

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} ${response.status}`);
  return response.json();
}

export function Readiness() {
  const [health, setHealth] = useState<BridgeHealth | null>(null);
  const [watchers, setWatchers] = useState<WatcherResponse | null>(null);
  const [routeChecks, setRouteChecks] = useState<RouteCheckResponse | null>(null);
  const [status, setStatus] = useState("Loading readiness evidence...");

  async function refresh() {
    try {
      const [nextHealth, nextWatchers, nextRoutes] = await Promise.all([
        getJson<BridgeHealth>("https://rpc.ynxweb4.com/bridge/health"),
        getJson<WatcherResponse>("https://rpc.ynxweb4.com/bridge/watchers"),
        getJson<RouteCheckResponse>("https://rpc.ynxweb4.com/bridge/route-checks"),
      ]);
      setHealth(nextHealth);
      setWatchers(nextWatchers);
      setRouteChecks(nextRoutes);
      setStatus("Live evidence refreshed");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Readiness evidence unavailable");
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  const watcherItems = Object.entries(watchers?.items || {});
  const routeItems = routeChecks?.items || [];
  const gates = useMemo<Gate[]>(() => {
    const watcherOk = watcherItems.length >= 2 && watcherItems.every(([, item]) => !item.last_error && item.last_scan_at);
    const routeOk = routeItems.length >= 5 && routeItems.every((item) => item.ok);
    return [
      {
        label: "Public services",
        ok: Boolean(health?.ok && health.onchain?.ready),
        detail: health?.ok ? "Bridge service and YNX on-chain gateway are ready." : "Bridge health is not confirmed.",
      },
      {
        label: "Automated deposit watcher",
        ok: watcherOk,
        detail: watcherOk ? "Sepolia ETH and USDC routes are scanned automatically." : "Watcher evidence is incomplete.",
      },
      {
        label: "Route mapping integrity",
        ok: routeOk,
        detail: routeOk ? "All configured wrapped-token mappings match the public gateway." : "One or more route mappings need attention.",
      },
      {
        label: "Public product flow",
        ok: true,
        detail: "Website exposes assets, Sepolia deposit, and YNX swap flows.",
      },
      {
        label: "Withdrawal release automation",
        ok: false,
        detail: "Outbound source-chain release is intentionally gated until testnet release automation and operator controls are enabled.",
      },
    ];
  }, [health, routeItems, watcherItems]);

  const passCount = gates.filter((gate) => gate.ok).length;

  return (
    <div className="min-h-screen pt-24 pb-24">
      <main className="mx-auto max-w-7xl px-6">
        <section className="grid gap-8 py-16 lg:grid-cols-[420px_1fr]">
          <div className="rounded-2xl border border-border bg-ink p-8 text-white shadow-xl">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-white/45">Mainnet-Grade Testnet</p>
                <h1 className="mt-2 text-4xl font-display font-bold tracking-tight">Readiness Gates</h1>
              </div>
              <ShieldCheck className="text-emerald-300" />
            </div>
            <p className="text-sm leading-6 text-white/65">
              Live evidence for whether the public testnet behaves like a mainnet rehearsal environment. Test assets still have no mainnet value.
            </p>
            <div className="mt-8 rounded-xl bg-white/5 p-4">
              <p className="text-xs font-mono uppercase tracking-widest text-white/40">Gate score</p>
              <p className="mt-2 text-3xl font-display font-bold">{passCount}/{gates.length}</p>
            </div>
            <Button onClick={refresh} variant="klein" className="mt-6 w-full rounded-xl">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Evidence
            </Button>
          </div>

          <div className="space-y-4">
            {gates.map((gate) => (
              <div key={gate.label} className="flex gap-4 rounded-2xl border border-border bg-white p-5 shadow-sm">
                <div className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${gate.ok ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-700"}`}>
                  {gate.ok ? <CheckCircle2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                </div>
                <div>
                  <p className="font-display text-lg font-semibold">{gate.label}</p>
                  <p className="mt-1 text-sm leading-6 text-ink/60">{gate.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <p className="text-xs font-mono uppercase tracking-widest text-ink/45">Bridge Health</p>
            <div className="mt-4 space-y-3 font-mono text-sm">
              <p>routes: {health?.stats?.routes ?? "-"}</p>
              <p>minted deposits: {health?.stats?.minted_deposits ?? "-"}</p>
              <p>watcher poll ms: {health?.onchain?.watcher_poll_ms ?? "-"}</p>
              <p>last error: {health?.onchain?.last_error || "-"}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm lg:col-span-2">
            <p className="text-xs font-mono uppercase tracking-widest text-ink/45">Automated Watchers</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {watcherItems.map(([routeId, watcher]) => (
                <div key={routeId} className="rounded-xl bg-surface p-3">
                  <p className="font-semibold text-ink">{routeId}</p>
                  <p className="mt-2 font-mono text-xs text-ink/60">block {watcher.last_scanned_block || "-"}</p>
                  <p className="font-mono text-xs text-ink/60">minted {watcher.deposits_minted ?? "-"}</p>
                  <p className="truncate font-mono text-xs text-ink/60">{watcher.last_scan_at || "-"}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-border bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-ink/45">Route Mapping</p>
              <h2 className="mt-1 font-display text-xl font-semibold">Gateway routes</h2>
            </div>
            <p className="text-sm text-ink/55">{status}</p>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {routeItems.map((item) => (
              <div key={item.routeId} className="rounded-xl bg-surface p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-ink">{item.routeId}</p>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold uppercase ${item.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                    {item.ok ? "ok" : "fail"}
                  </span>
                </div>
                <p className="mt-2 truncate font-mono text-xs text-ink/60">{item.mappedWrappedToken || item.error || "-"}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <Link to="/test-assets" className="rounded-2xl border border-border bg-white p-5 shadow-sm transition hover:border-klein/40">
            <p className="font-display text-lg font-semibold">Test Assets</p>
            <p className="mt-2 text-sm text-ink/60">Fund gas and add live YNX test assets.</p>
          </Link>
          <Link to="/bridge" className="rounded-2xl border border-border bg-white p-5 shadow-sm transition hover:border-klein/40">
            <p className="font-display text-lg font-semibold">Bridge</p>
            <p className="mt-2 text-sm text-ink/60">Deposit Sepolia ETH and USDC into YNX.</p>
          </Link>
          <a href="https://rpc.ynxweb4.com/bridge/health" target="_blank" rel="noreferrer" className="rounded-2xl border border-border bg-white p-5 shadow-sm transition hover:border-klein/40">
            <p className="flex items-center gap-2 font-display text-lg font-semibold">
              Raw Evidence <ExternalLink className="h-4 w-4" />
            </p>
            <p className="mt-2 text-sm text-ink/60">Open the live bridge health JSON.</p>
          </a>
        </section>

        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          <Activity className="mb-2 h-4 w-4" />
          This is mainnet-grade rehearsal infrastructure, not mainnet value infrastructure. Real mainnet status still requires external audits, independent operators, full withdrawal release automation, and production legal/compliance sign-off.
        </div>
      </main>
    </div>
  );
}

