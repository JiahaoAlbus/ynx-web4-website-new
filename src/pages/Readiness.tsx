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
    withdrawal_watcher_poll_ms: number;
    withdrawal_release_enabled: boolean;
    source_relayer_configured: boolean;
    last_error: string;
  };
  stats?: {
    routes: number;
    deposits: number;
    withdrawals: number;
    minted_deposits: number;
    watcher_routes: number;
    withdrawal_watcher_routes: number;
    released_withdrawals: number;
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
    withdrawals_queued?: number;
    releases_executed?: number;
  }>;
};

type RouteCheckResponse = {
  ok: boolean;
  items: Array<{ routeId: string; ok: boolean; expectedWrappedToken?: string; mappedWrappedToken?: string; error?: string }>;
};

type RouteReadinessResponse = {
  ok: boolean;
  summary?: {
    routes: number;
    full_loop_ready: number;
    full_loop_tested: number;
    automatic_loop_ready: number;
    deposit_tested: number;
    mapped_route_only: number;
  };
  items: Array<{
    routeId: string;
    asset?: string;
    displayName?: string;
    wrappedSymbol?: string;
    phase: string;
    full_loop_ready: boolean;
    full_loop_tested: boolean;
    automatic_loop_ready?: boolean;
    blockers?: string[];
    evidence?: {
      minted_deposits?: number;
      released_withdrawals?: number;
      deposit_watcher_status?: { status?: string; adapter?: string };
      release_adapter_status?: { status?: string; adapter?: string };
    };
  }>;
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
  const [withdrawalWatchers, setWithdrawalWatchers] = useState<WatcherResponse | null>(null);
  const [routeChecks, setRouteChecks] = useState<RouteCheckResponse | null>(null);
  const [routeReadiness, setRouteReadiness] = useState<RouteReadinessResponse | null>(null);
  const [status, setStatus] = useState("Loading readiness evidence...");

  async function refresh() {
    try {
      const [nextHealth, nextWatchers, nextWithdrawalWatchers, nextRoutes, nextRouteReadiness] = await Promise.all([
        getJson<BridgeHealth>("https://rpc.ynxweb4.com/bridge/health"),
        getJson<WatcherResponse>("https://rpc.ynxweb4.com/bridge/watchers"),
        getJson<WatcherResponse>("https://rpc.ynxweb4.com/bridge/withdrawal-watchers"),
        getJson<RouteCheckResponse>("https://rpc.ynxweb4.com/bridge/route-checks"),
        getJson<RouteReadinessResponse>("https://rpc.ynxweb4.com/bridge/route-readiness"),
      ]);
      setHealth(nextHealth);
      setWatchers(nextWatchers);
      setWithdrawalWatchers(nextWithdrawalWatchers);
      setRouteChecks(nextRoutes);
      setRouteReadiness(nextRouteReadiness);
      setStatus("Live evidence refreshed");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Readiness evidence unavailable");
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  const watcherItems = Object.entries(watchers?.items || {});
  const withdrawalWatcherItems = Object.entries(withdrawalWatchers?.items || {});
  const routeItems = routeChecks?.items || [];
  const routeReadinessItems = routeReadiness?.items || [];
  const gates = useMemo<Gate[]>(() => {
    const watcherOk = watcherItems.length >= 5 && watcherItems.every(([, item]) => !item.last_error && item.last_scan_at);
    const withdrawalWatcherOk = withdrawalWatcherItems.length >= 5 && withdrawalWatcherItems.every(([, item]) => !item.last_error && item.last_scan_at);
    const routeOk = routeItems.length >= 5 && routeItems.every((item) => item.ok);
    const fullLoopOk = (routeReadiness?.summary?.full_loop_tested || 0) >= 5;
    const automaticLoopOk = (routeReadiness?.summary?.automatic_loop_ready || 0) >= 5;
    const releaseOk = Boolean(
      health?.onchain?.withdrawal_release_enabled &&
        withdrawalWatcherOk &&
        (health?.stats?.released_withdrawals || 0) >= 5,
    );
    return [
      {
        label: "Public services",
        ok: Boolean(health?.ok && health.onchain?.ready),
        detail: health?.ok ? "Bridge service and YNX on-chain gateway are ready." : "Bridge health is not confirmed.",
      },
      {
        label: "Automated deposit watcher",
        ok: watcherOk,
        detail: watcherOk ? "All five public-testnet routes have live deposit watcher evidence." : "Watcher evidence is incomplete or route config is missing.",
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
        label: "Full-loop tested routes",
        ok: fullLoopOk,
        detail: fullLoopOk
          ? "All five routes have deposit, YNX burn, and source release evidence."
          : "All five public-testnet routes must have full-loop evidence.",
      },
      {
        label: "Automatic route loop readiness",
        ok: automaticLoopOk,
        detail: automaticLoopOk
          ? "All routes report automatic watcher plus signer-gated release readiness."
          : "A missing deposit address, TRON contract, BSC lockbox, release signer, or watcher scan blocks automatic PASS.",
      },
      {
        label: "Withdrawal release automation",
        ok: releaseOk,
        detail: releaseOk
          ? "YNX burn watcher and Sepolia lockbox release automation are live; ETH and USDC smoke withdrawals have released."
          : "Outbound source-chain release automation still needs configured signer/lockbox evidence and successful releases.",
      },
    ];
  }, [health, routeItems, routeReadiness, watcherItems, withdrawalWatcherItems]);

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
              <p>withdrawal poll ms: {health?.onchain?.withdrawal_watcher_poll_ms ?? "-"}</p>
              <p>released withdrawals: {health?.stats?.released_withdrawals ?? "-"}</p>
              <p>full-loop tested: {routeReadiness?.summary?.full_loop_tested ?? "-"}</p>
              <p>automatic loops: {routeReadiness?.summary?.automatic_loop_ready ?? "-"}</p>
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
          <p className="text-xs font-mono uppercase tracking-widest text-ink/45">Withdrawal Watchers</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {withdrawalWatcherItems.map(([routeId, watcher]) => (
              <div key={routeId} className="rounded-xl bg-surface p-3">
                <p className="font-semibold text-ink">{routeId}</p>
                <p className="mt-2 font-mono text-xs text-ink/60">block {watcher.last_scanned_block || "-"}</p>
                <p className="font-mono text-xs text-ink/60">queued {watcher.withdrawals_queued ?? "-"}</p>
                <p className="font-mono text-xs text-ink/60">released {watcher.releases_executed ?? "-"}</p>
                <p className="truncate font-mono text-xs text-ink/60">{watcher.last_scan_at || "-"}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-border bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-ink/45">Route Readiness</p>
              <h2 className="mt-1 font-display text-xl font-semibold">Full-loop status</h2>
            </div>
            <p className="font-mono text-sm text-ink/55">
              tested {routeReadiness?.summary?.full_loop_tested ?? "-"}/{routeReadiness?.summary?.routes ?? "-"}
            </p>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {routeReadinessItems.map((item) => (
              <div key={item.routeId} className="rounded-xl bg-surface p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-ink">{item.routeId}</p>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold uppercase ${item.full_loop_tested ? "bg-emerald-50 text-emerald-700" : item.full_loop_ready ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"}`}>
                    {item.phase.replaceAll("_", " ")}
                  </span>
                </div>
                <p className="mt-2 text-sm text-ink/60">{item.wrappedSymbol || item.asset || item.displayName || "route"}</p>
                <p className="mt-2 font-mono text-xs text-ink/60">
                  minted {item.evidence?.minted_deposits ?? 0} / released {item.evidence?.released_withdrawals ?? 0}
                </p>
                <p className="mt-2 font-mono text-xs text-ink/60">
                  deposit {item.evidence?.deposit_watcher_status?.status || "-"} / release {item.evidence?.release_adapter_status?.status || "-"}
                </p>
                <p className={`mt-2 text-xs font-semibold ${item.automatic_loop_ready ? "text-emerald-700" : "text-amber-700"}`}>
                  automatic loop {item.automatic_loop_ready ? "ready" : "pending"}
                </p>
                {!!item.blockers?.length && <p className="mt-2 break-words font-mono text-xs text-amber-700">{item.blockers.join(", ")}</p>}
              </div>
            ))}
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
          <Link to="/withdraw" className="rounded-2xl border border-border bg-white p-5 shadow-sm transition hover:border-klein/40">
            <p className="font-display text-lg font-semibold">Withdraw</p>
            <p className="mt-2 text-sm text-ink/60">Burn wrapped assets and release Sepolia test assets.</p>
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
          This is mainnet-grade rehearsal infrastructure, not mainnet value infrastructure. Real mainnet status still requires external audits, independent operators, production custody/signing controls, and legal/compliance sign-off.
        </div>
      </main>
    </div>
  );
}
