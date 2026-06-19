import { useEffect, useMemo, useState } from "react";
import { Activity, AlertTriangle, CheckCircle2, ExternalLink, RefreshCw, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  countDepositTested,
  countDepositWatchersLive,
  countReleaseObserved,
  hasReleaseEvidence,
  routeDisplayName,
  summarizeBlockers,
  summarizeDepositStatus,
  summarizeReleaseStatus,
  summarizeRoutePhase,
} from "../lib/routeReadiness";
import { fetchJsonWithTimeout } from "../lib/request";

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
  return fetchJsonWithTimeout<T>(url, { timeoutMs: 12000 });
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
  const routeTotal = routeReadiness?.summary?.routes || routeReadinessItems.length || 5;
  const depositWatchersLive = countDepositWatchersLive(routeReadinessItems);
  const depositTested = countDepositTested(routeReadinessItems);
  const releaseObserved = countReleaseObserved(routeReadinessItems);

  const gates = useMemo<Gate[]>(() => {
    const watcherOk = depositWatchersLive >= 4;
    const withdrawalWatcherOk = withdrawalWatcherItems.length >= 5 && withdrawalWatcherItems.every(([, item]) => !item.last_error && item.last_scan_at);
    const routeOk = routeItems.length >= 5 && routeItems.every((item) => item.ok);
    const depositTestedOk = depositTested >= 2;
    const releaseObservedOk = releaseObserved >= 2;
    const automaticLoopOk = (routeReadiness?.summary?.automatic_loop_ready || 0) >= 1;
    const releaseOk = Boolean(
      health?.onchain?.withdrawal_release_enabled &&
        withdrawalWatcherOk &&
        (health?.stats?.released_withdrawals || 0) >= 2,
    );

    return [
      {
        label: "Public services",
        ok: Boolean(health?.ok),
        detail: health?.ok ? "Bridge service JSON is responding on the public testnet." : "Bridge health is not currently confirmed.",
      },
      {
        label: "Automated deposit watcher",
        ok: watcherOk,
        detail: `${depositWatchersLive}/${routeTotal} routes show live deposit-watcher evidence.`,
      },
      {
        label: "Route mapping integrity",
        ok: routeOk,
        detail: routeOk ? "Configured wrapped-token mappings match the gateway." : "One or more route mappings need attention.",
      },
      {
        label: "Deposit-tested routes",
        ok: depositTestedOk,
        detail: `${depositTested}/${routeTotal} routes show public deposit evidence today.`,
      },
      {
        label: "Routes with release evidence",
        ok: releaseObservedOk,
        detail: `${releaseObserved}/${routeTotal} routes show observed release evidence, even when release remains partially manual.`,
      },
      {
        label: "Automatic release readiness",
        ok: automaticLoopOk || releaseOk,
        detail:
          automaticLoopOk || releaseOk
            ? "At least one route reports stronger automatic-release readiness."
            : "Automatic release is still blocked by missing signer, lockbox, or release-enable configuration.",
      },
    ];
  }, [depositTested, depositWatchersLive, health, releaseObserved, routeItems, routeReadiness, routeTotal, watcherItems.length, withdrawalWatcherItems]);

  const passCount = gates.filter((gate) => gate.ok).length;

  return (
    <div className="min-h-screen pt-24 pb-28">
      <main className="mx-auto max-w-7xl px-6">
        <section className="grid gap-8 py-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="overflow-hidden rounded-[2rem] border border-border bg-white shadow-sm">
            <div className="ynx-mesh border-b border-border px-8 py-10">
              <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-ink/45">Mainnet-Candidate Discipline</p>
              <h1 className="mt-4 max-w-3xl font-display text-5xl font-semibold tracking-tight text-ink md:text-6xl">
                Readiness is framed as gates, not a marketing adjective.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-ink/68 md:text-lg">
                This page collects live public evidence for route health, watcher automation, and release behavior. A green status here
                means a testnet rehearsal gate appears satisfied. It does not by itself convert YNX into a launched production system.
              </p>
            </div>

            <div className="grid gap-4 px-8 py-8 md:grid-cols-3">
              <div className="rounded-2xl border border-border bg-surface/70 p-5">
                <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink/45">Strongest Evidence</p>
                <p className="mt-3 text-sm leading-6 text-ink/72">
                  Live watcher scans, route mappings, minted deposits, and released withdrawals on public test assets.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-surface/70 p-5">
                <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink/45">Not Proven Here</p>
                <p className="mt-3 text-sm leading-6 text-ink/72">
                  No external audit, no institutional signing controls evidence, and no legal/compliance sign-off is proven by these JSON feeds.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-surface/70 p-5">
                <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink/45">Next Threshold</p>
                <p className="mt-3 text-sm leading-6 text-ink/72">
                  Turn route rehearsal into externally reviewable operational maturity with independent operators and stronger controls.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-ink p-8 text-white shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-white/45">Gate Score</p>
                <h2 className="mt-3 font-display text-5xl font-semibold tracking-tight">{passCount}/{gates.length}</h2>
              </div>
              <ShieldCheck className="h-6 w-6 text-emerald-300" />
            </div>
            <p className="mt-6 text-sm leading-6 text-white/72">
              The score is a compact summary of rehearsal completeness. It should be read alongside the failed gates and remaining blockers,
              not as a binary claim that YNX is production-ready.
            </p>
            <div className="mt-8 grid gap-3">
              <Button onClick={refresh} variant="klein" className="justify-between rounded-xl">
                Refresh Evidence
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button asChild variant="outline" className="justify-between rounded-xl border-white/15 bg-white/5 text-white hover:bg-white/10">
                <a href="https://rpc.ynxweb4.com/bridge/health" target="_blank" rel="noreferrer">
                  Open Raw JSON
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-6 text-white/65">
              Remaining gap categories: external audit, production signing controls, durable independent validator operations, and formal legal structure.
            </div>
          </div>
        </section>

        <section className="grid gap-4">
          {gates.map((gate) => (
            <div key={gate.label} className="flex gap-4 rounded-[1.5rem] border border-border bg-white p-5 shadow-sm">
              <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${gate.ok ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-700"}`}>
                {gate.ok ? <CheckCircle2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
              </div>
              <div>
                <p className="font-display text-xl font-semibold text-ink">{gate.label}</p>
                <p className="mt-1 text-sm leading-6 text-ink/62">{gate.detail}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="rounded-[2rem] border border-border bg-white p-8 shadow-sm">
            <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink/45">Bridge Health</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink">Operational counters</h2>
            <div className="mt-8 space-y-3">
              {[
                ["routes", health?.stats?.routes ?? "-"],
                ["deposit watchers live", `${depositWatchersLive}/${routeTotal}`],
                ["deposit-tested routes", `${depositTested}/${routeTotal}`],
                ["routes with release evidence", `${releaseObserved}/${routeTotal}`],
                ["minted deposits", health?.stats?.minted_deposits ?? "-"],
                ["released withdrawals", health?.stats?.released_withdrawals ?? "-"],
                ["watcher poll ms", health?.onchain?.watcher_poll_ms ?? "-"],
                ["withdrawal poll ms", health?.onchain?.withdrawal_watcher_poll_ms ?? "-"],
                ["automatic loops", routeReadiness?.summary?.automatic_loop_ready ?? "-"],
                ["last error", health?.onchain?.last_error || "-"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface/60 px-4 py-3">
                  <span className="text-sm text-ink/55">{label}</span>
                  <span className="font-mono text-sm text-ink">{value}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm leading-6 text-ink/60">{status}</p>
          </div>

          <div className="rounded-[2rem] border border-border bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink/45">Route Readiness</p>
                <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink">Per-route evidence</h2>
              </div>
              <p className="font-mono text-sm text-ink/55">
                deposit tested {depositTested}/{routeTotal}
              </p>
            </div>
            <div className="mt-8 grid gap-3 md:grid-cols-2">
              {routeReadinessItems.map((item) => (
                <div key={item.routeId} className="rounded-2xl border border-border bg-surface/60 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-ink">{routeDisplayName(item)}</p>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase ${item.automatic_loop_ready ? "bg-emerald-50 text-emerald-700" : hasReleaseEvidence(item) ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"}`}>
                      {summarizeRoutePhase(item)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-ink/60">{item.routeId}</p>
                  <p className="mt-3 font-mono text-xs text-ink/60">
                    minted {item.evidence?.minted_deposits ?? 0} / released {item.evidence?.released_withdrawals ?? 0}
                  </p>
                  <p className="mt-2 font-mono text-xs text-ink/60">
                    deposit {summarizeDepositStatus(item)} / release {summarizeReleaseStatus(item)}
                  </p>
                  <p className={`mt-2 text-xs font-semibold ${item.automatic_loop_ready ? "text-emerald-700" : "text-amber-700"}`}>
                    automatic loop {item.automatic_loop_ready ? "ready" : "pending"}
                  </p>
                  {!!item.blockers?.length && <p className="mt-2 break-words font-mono text-xs text-amber-700">{summarizeBlockers(item).join(", ")}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-border bg-white p-8 shadow-sm">
            <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink/45">Watchers</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink">Deposit and withdrawal scan traces</h2>
            <div className="mt-8 grid gap-3 md:grid-cols-2">
              {watcherItems.map(([routeId, watcher]) => (
                <div key={routeId} className="rounded-2xl border border-border bg-surface/60 p-4">
                  <p className="font-semibold text-ink">{routeId}</p>
                  <p className="mt-3 font-mono text-xs text-ink/60">block {watcher.last_scanned_block || "-"}</p>
                  <p className="font-mono text-xs text-ink/60">minted {watcher.deposits_minted ?? "-"}</p>
                  <p className="truncate font-mono text-xs text-ink/60">{watcher.last_scan_at || "-"}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {withdrawalWatcherItems.map(([routeId, watcher]) => (
                <div key={routeId} className="rounded-2xl border border-border bg-surface/60 p-4">
                  <p className="font-semibold text-ink">{routeId}</p>
                  <p className="mt-3 font-mono text-xs text-ink/60">block {watcher.last_scanned_block || "-"}</p>
                  <p className="font-mono text-xs text-ink/60">queued {watcher.withdrawals_queued ?? "-"}</p>
                  <p className="font-mono text-xs text-ink/60">released {watcher.releases_executed ?? "-"}</p>
                  <p className="truncate font-mono text-xs text-ink/60">{watcher.last_scan_at || "-"}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-white p-8 shadow-sm">
            <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink/45">Route Mapping</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink">Gateway integrity checks</h2>
            <div className="mt-8 grid gap-3 md:grid-cols-2">
              {routeItems.map((item) => (
                <div key={item.routeId} className="rounded-2xl border border-border bg-surface/60 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-ink">{item.routeId}</p>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase ${item.ok ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                      {item.ok ? "ok" : "fail"}
                    </span>
                  </div>
                  <p className="mt-3 truncate font-mono text-xs text-ink/60">{item.mappedWrappedToken || item.error || "-"}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
              <Activity className="mb-2 h-4 w-4" />
              This page argues for mainnet-candidate discipline, not finished production status. Real mainnet status still requires external audits,
              independent operators, production signing and custody controls, and formal legal/compliance work.
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-4">
          <Link to="/test-assets" className="rounded-[1.5rem] border border-border bg-white p-5 shadow-sm transition hover:border-klein/40">
            <p className="font-display text-lg font-semibold">Test Assets</p>
            <p className="mt-2 text-sm text-ink/60">Fund gas and add public test assets.</p>
          </Link>
          <Link to="/bridge" className="rounded-[1.5rem] border border-border bg-white p-5 shadow-sm transition hover:border-klein/40">
            <p className="font-display text-lg font-semibold">Bridge</p>
            <p className="mt-2 text-sm text-ink/60">Inspect deposit routes and current bridge surface.</p>
          </Link>
          <Link to="/withdraw" className="rounded-[1.5rem] border border-border bg-white p-5 shadow-sm transition hover:border-klein/40">
            <p className="font-display text-lg font-semibold">Withdraw</p>
            <p className="mt-2 text-sm text-ink/60">Check burn and source-release flow.</p>
          </Link>
          <a href="https://rpc.ynxweb4.com/bridge/health" target="_blank" rel="noreferrer" className="rounded-[1.5rem] border border-border bg-white p-5 shadow-sm transition hover:border-klein/40">
            <p className="flex items-center gap-2 font-display text-lg font-semibold">
              Raw Evidence <ExternalLink className="h-4 w-4" />
            </p>
            <p className="mt-2 text-sm text-ink/60">Open live bridge health JSON.</p>
          </a>
        </section>
      </main>
    </div>
  );
}
