import { useState } from "react";
import { Activity, Check, Copy, ExternalLink, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { PublicOpsBoard } from "../components/PublicOpsBoard";
import { NETWORK } from "../constants/network";
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import { useValidatorReadiness } from "../hooks/useValidatorReadiness";

export function Testnet() {
  const { status, loading, refetch } = useNetworkStatus();
  const { snapshot, loading: validatorLoading } = useValidatorReadiness();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const endpoints = [
    { label: "RPC", url: NETWORK.endpoints.rpc, id: "rpc" },
    { label: "gRPC", url: NETWORK.endpoints.grpc, id: "grpc" },
    { label: "EVM RPC", url: NETWORK.endpoints.evm, id: "evm" },
    { label: "Faucet", url: NETWORK.endpoints.faucet, id: "faucet" },
    { label: "Indexer", url: NETWORK.endpoints.indexer, id: "indexer" },
    { label: "Explorer", url: NETWORK.endpoints.explorer, id: "explorer" },
    { label: "AI Gateway", url: NETWORK.endpoints.ai, id: "ai" },
    { label: "Web4 Hub", url: NETWORK.endpoints.web4, id: "web4" },
  ];

  const networkSummary = status?.summary;
  const infrastructureLabel =
    networkSummary === "online"
      ? "Public services responding"
      : networkSummary === "degraded"
        ? "Public services degraded"
        : networkSummary === "offline"
          ? "Public services offline"
          : "Checking public services";
  const infrastructureDot =
    networkSummary === "online"
      ? "bg-emerald-500"
      : networkSummary === "degraded"
        ? "bg-amber-500"
        : networkSummary === "offline"
          ? "bg-rose-500"
          : "bg-ink/30";

  const validatorRows = snapshot?.validators.slice(0, 6) ?? [];
  const validatorGateLabel = snapshot
    ? snapshot.validator_gate_pass
      ? "Validator gate passed"
      : `Validator gate pending (${snapshot.bonded_count}/${snapshot.min_validators})`
    : validatorLoading
      ? "Checking validator gate"
      : "Validator gate unavailable";

  function handleCopy(text: string, index: number) {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    window.setTimeout(() => setCopiedIndex(null), 1800);
  }

  function statusTone(serviceStatus?: string) {
    if (serviceStatus === "online") return "bg-emerald-50 text-emerald-700";
    if (serviceStatus === "degraded") return "bg-amber-50 text-amber-700";
    if (serviceStatus === "offline") return "bg-rose-50 text-rose-700";
    return "bg-surface text-ink/55";
  }

  return (
    <div className="min-h-screen pt-24 pb-28">
      <main className="mx-auto max-w-7xl px-6">
        <section className="grid gap-8 py-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="overflow-hidden rounded-[2rem] border border-border bg-white shadow-sm">
            <div className="ynx-mesh border-b border-border px-8 py-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-klein/15 bg-white/85 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.24em] text-ink/65 backdrop-blur">
                <span className={`h-2 w-2 rounded-full ${infrastructureDot}`} />
                {infrastructureLabel}
              </div>
              <h1 className="mt-6 max-w-3xl font-display text-5xl font-semibold tracking-tight text-ink md:text-6xl">
                Public testnet infrastructure, presented as evidence rather than hype.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-ink/68 md:text-lg">
                YNX is publicly reachable and operable today as a testnet environment. That means endpoints, validators,
                bridge rehearsal routes, and AI-facing interfaces can be checked live. It does not mean production launch,
                real-value settlement, or legal/compliance completion.
              </p>
            </div>

            <div className="grid gap-4 px-8 py-8 md:grid-cols-3">
              <div className="rounded-2xl border border-border bg-surface/70 p-5">
                <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink/45">What Is Live</p>
                <p className="mt-3 text-sm leading-6 text-ink/72">
                  Public RPC, explorer, faucet, EVM surface, bridge telemetry, and AI gateway endpoints.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-surface/70 p-5">
                <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink/45">What It Is Not</p>
                <p className="mt-3 text-sm leading-6 text-ink/72">
                  Not mainnet, not a launched legal service, not a proof of regulated custody, and not real-asset trading.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-surface/70 p-5">
                <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink/45">This Round Funds</p>
                <p className="mt-3 text-sm leading-6 text-ink/72">
                  Security hardening, independent operators, release controls, legal setup, and production readiness gates.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-ink p-8 text-white shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-white/45">Current Boundary</p>
                <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">Operationally visible, institutionally early.</h2>
              </div>
              <Activity className="h-6 w-6 text-blue-300" />
            </div>
            <div className="mt-8 space-y-4 text-sm leading-6 text-white/72">
              <p>Live endpoints are evidence of public accessibility, not by themselves evidence of production reliability.</p>
              <p>Validator and route metrics show rehearsal depth, not finished decentralization or finished release operations.</p>
              <p>Investors should read this page together with <Link to="/readiness" className="text-white underline underline-offset-4">Readiness</Link> and <Link to="/risk" className="text-white underline underline-offset-4">Risk</Link>.</p>
            </div>
            <div className="mt-8 grid gap-3">
              <Button variant="klein" className="justify-between rounded-xl" onClick={refetch}>
                Refresh Public Status
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </Button>
              <Button asChild variant="outline" className="justify-between rounded-xl border-white/15 bg-white/5 text-white hover:bg-white/10">
                <Link to="/readiness">
                  Review Readiness Gates
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="mb-20">
          <PublicOpsBoard />
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-border bg-white p-8 shadow-sm">
            <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink/45">Chain Reference</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink">Canonical network identifiers</h2>
            <div className="mt-8 space-y-5">
              <div className="rounded-2xl border border-border bg-surface/70 p-4">
                <p className="text-xs text-ink/45">Cosmos chain ID</p>
                <p className="mt-2 font-mono text-xl text-ink">{NETWORK.chainId}</p>
              </div>
              <div className="rounded-2xl border border-border bg-surface/70 p-4">
                <p className="text-xs text-ink/45">EVM chain ID</p>
                <p className="mt-2 font-mono text-xl text-ink">{NETWORK.evmChainId}</p>
              </div>
              <div className="rounded-2xl border border-border bg-surface/70 p-4">
                <p className="text-xs text-ink/45">Settlement denom</p>
                <p className="mt-2 font-mono text-xl text-ink">{NETWORK.denom}</p>
              </div>
              <div className="rounded-2xl border border-border bg-klein/[0.06] p-4">
                <p className="text-xs text-klein/70">Validator gate</p>
                <p className="mt-2 text-sm font-semibold text-ink">{validatorGateLabel}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink/45">Public Endpoints</p>
                <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink">Reachability surface</h2>
              </div>
              <button
                onClick={refetch}
                className="rounded-full border border-border p-2 text-ink/45 transition hover:border-klein/30 hover:text-klein"
                title="Refresh"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>
            <div className="mt-8 grid gap-3 md:grid-cols-2">
              {endpoints.map((endpoint, index) => (
                <div key={endpoint.label} className="rounded-2xl border border-border bg-surface/60 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink/45">{endpoint.label}</p>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase ${statusTone(status?.[endpoint.id]?.status)}`}>
                      {status?.[endpoint.id]?.status || (loading ? "checking" : "unknown")}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <code className="min-w-0 flex-1 truncate rounded-xl border border-border bg-white px-3 py-2 font-mono text-xs text-ink/70">
                      {endpoint.url}
                    </code>
                    <button
                      onClick={() => handleCopy(endpoint.url, index)}
                      className="rounded-xl border border-border bg-white p-2 text-ink/45 transition hover:border-klein/30 hover:text-klein"
                    >
                      {copiedIndex === index ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-border bg-white p-8 shadow-sm">
            <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink/45">Validator Snapshot</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink">Observed operator set</h2>
            <div className="mt-8 space-y-3">
              {validatorRows.length === 0 ? (
                <div className="rounded-2xl border border-border bg-surface/60 p-4 text-sm text-ink/60">
                  {validatorLoading ? "Loading live validator set..." : "Validator snapshot unavailable."}
                </div>
              ) : (
                validatorRows.map((validator) => (
                  <div key={validator.operator} className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface/60 p-4">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-ink">{validator.moniker || validator.operator}</p>
                      <p className="mt-1 truncate font-mono text-xs text-ink/45">{validator.operator}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase ${validator.jailed ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>
                      {validator.jailed ? "jailed" : "bonded"}
                    </span>
                  </div>
                ))
              )}
            </div>
            <p className="mt-6 text-sm leading-6 text-ink/60">
              {snapshot
                ? `${snapshot.bonded_count} bonded validators are currently visible. The mainnet candidate threshold is at least ${snapshot.min_validators} bonded validators, but decentralization quality still depends on operator independence and sustained uptime.`
                : "External validator participation remains part of the path to a stronger decentralization story."}
            </p>
          </div>

          <div className="rounded-[2rem] border border-amber-200 bg-amber-50/90 p-8 shadow-sm">
            <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-amber-700">Interpretation Guardrail</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-amber-950">What investors should not over-read</h2>
            <div className="mt-8 space-y-4 text-sm leading-6 text-amber-950/85">
              <p>A responsive faucet or explorer does not by itself prove production reliability.</p>
              <p>A passing validator gate does not by itself prove durable decentralization or governance maturity.</p>
              <p>Bridge route evidence on test assets does not convert into a claim of real-value custody or live wrapped-asset distribution.</p>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Button asChild variant="outline" className="justify-between rounded-xl border-amber-300 bg-white/70 text-amber-950 hover:bg-white">
                <Link to="/bridge">
                  View Bridge Surface
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-between rounded-xl border-amber-300 bg-white/70 text-amber-950 hover:bg-white">
                <a href={NETWORK.endpoints.explorer} target="_blank" rel="noreferrer">
                  Open Explorer
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
