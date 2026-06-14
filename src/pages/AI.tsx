import { useEffect, useMemo, useState } from "react";
import { Bot, Brain, CheckCircle2, ListChecks, Play, RefreshCw, Send, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";
import { fetchJsonWithTimeout } from "../lib/request";

type IntelligenceBrief = {
  ok: boolean;
  mode: string;
  answer: string;
  context?: {
    ai?: {
      stats?: {
        total_jobs?: number;
        total_vaults?: number;
        total_payments?: number;
        by_status?: Record<string, number>;
      };
      onchain?: {
        ready?: boolean;
        settlement_contract?: string;
        last_tx_hash?: string;
      };
    };
    bridge?: {
      route_readiness?: {
        summary?: {
          routes?: number;
          full_loop_tested?: number;
          automatic_loop_ready?: number;
          mapped_route_only?: number;
        };
        items?: Array<{ routeId: string; phase: string; full_loop_tested?: boolean; automatic_loop_ready?: boolean }>;
      };
      health?: {
        stats?: {
          minted_deposits?: number;
          released_withdrawals?: number;
        };
      };
    };
  };
};

type ChatResponse = {
  ok: boolean;
  mode: string;
  model?: string;
  answer: string;
  llm_error?: string;
};

type ActionCatalog = {
  ok: boolean;
  actions: Array<{
    action: string;
    title: string;
    mode: string;
    auth: string;
    description: string;
  }>;
};

type ActionRunResponse = {
  ok: boolean;
  action?: string;
  result?: unknown;
  error?: string;
};

const AI_BRIEF_URL = "https://ai.ynxweb4.com/ai/intelligence/brief";
const AI_CHAT_URL = "https://ai.ynxweb4.com/ai/chat";
const AI_ACTIONS_URL = "https://ai.ynxweb4.com/ai/actions";
const AI_ACTION_RUN_URL = "https://ai.ynxweb4.com/ai/actions/run";

async function getJson<T>(url: string): Promise<T> {
  return fetchJsonWithTimeout<T>(url, { timeoutMs: 3500 });
}

export function AI() {
  const [brief, setBrief] = useState<IntelligenceBrief | null>(null);
  const [question, setQuestion] = useState("What is the current state of AI, bridge, and trading on the public YNX testnet, and what remains before a stronger production claim?");
  const [answer, setAnswer] = useState("");
  const [mode, setMode] = useState("-");
  const [status, setStatus] = useState("Loading YNX intelligence...");
  const [busy, setBusy] = useState(false);
  const [actions, setActions] = useState<ActionCatalog["actions"]>([]);
  const [actionStatus, setActionStatus] = useState("Action layer loading...");
  const [actionBusy, setActionBusy] = useState("");
  const [actionResult, setActionResult] = useState("");

  async function refreshBrief() {
    try {
      const [next, catalog] = await Promise.all([
        getJson<IntelligenceBrief>(AI_BRIEF_URL),
        getJson<ActionCatalog>(AI_ACTIONS_URL).catch(() => null),
      ]);
      setBrief(next);
      setAnswer((current) => current || next.answer || "");
      setMode(next.mode || "-");
      setStatus("Live intelligence ready");
      if (catalog?.ok) {
        setActions(catalog.actions || []);
        setActionStatus("Action layer ready");
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "AI brief unavailable");
    }
  }

  async function ask() {
    if (!question.trim()) return;
    setBusy(true);
    setStatus("Querying live YNX context...");
    try {
      const response = await fetch(AI_CHAT_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        signal: AbortSignal.timeout(6000),
        body: JSON.stringify({ message: question }),
      });
      if (!response.ok) throw new Error(`chat ${response.status}`);
      const json = (await response.json()) as ChatResponse;
      setAnswer(json.answer);
      setMode(json.mode || json.model || "-");
      setStatus(json.llm_error ? `Live fallback: ${json.llm_error}` : "Answer updated");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "AI chat unavailable");
    } finally {
      setBusy(false);
    }
  }

  async function runAction(action: string) {
    setActionBusy(action);
    setActionStatus(`Running ${action}...`);
    try {
      const actionBody = action === "trade.quote" || action === "trade.preflight"
        ? { action, from_symbol: "YUSD.test", to_symbol: "wUSDC.y", amount: "0.1" }
        : action === "trade.prepare" || action === "trade.execute"
          ? {
              action,
              from_symbol: "YUSD.test",
              to_symbol: "wUSDC.y",
              amount: "0.1",
              recipient: "0x00000000000000000000000000000000000000aa",
              slippage_bps: 100,
            }
          : { action };
      const response = await fetch(AI_ACTION_RUN_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        signal: AbortSignal.timeout(6000),
        body: JSON.stringify(actionBody),
      });
      const json = (await response.json()) as ActionRunResponse;
      if (!response.ok || json.ok === false) throw new Error(json.error || `action ${response.status}`);
      setActionResult(JSON.stringify(json.result ?? json, null, 2));
      setActionStatus(`${action} completed`);
    } catch (error) {
      setActionResult("");
      setActionStatus(error instanceof Error ? error.message : `${action} failed`);
    } finally {
      setActionBusy("");
    }
  }

  useEffect(() => {
    void refreshBrief();
  }, []);

  const routeItems = brief?.context?.bridge?.route_readiness?.items || [];
  const routeSummary = brief?.context?.bridge?.route_readiness?.summary || {};
  const aiStats = brief?.context?.ai?.stats || {};
  const bridgeStats = brief?.context?.bridge?.health?.stats || {};
  const onchain = brief?.context?.ai?.onchain || {};
  const answerLines = useMemo(() => answer.split(/\n/).filter((line) => line.trim().length > 0), [answer]);
  const publicActions = ["assets.list", "validators.status", "bridge.readiness", "trade.quote", "trade.preflight", "trade.prepare", "trade.execute", "tx.latest"];
  const actionMap = useMemo(() => new Map(actions.map((item) => [item.action, item])), [actions]);

  return (
    <div className="min-h-screen pt-24 pb-28">
      <main className="mx-auto max-w-7xl px-6">
        <section className="grid gap-8 py-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="overflow-hidden rounded-[2rem] border border-border bg-white shadow-sm">
            <div className="ynx-mesh border-b border-border px-8 py-10">
              <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-ink/45">Public Intelligence Layer</p>
              <h1 className="mt-4 max-w-3xl font-display text-5xl font-semibold tracking-tight text-ink md:text-6xl">
                AI here is presented as an interface to live testnet context, not as magic.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-ink/68 md:text-lg">
                The gateway can summarize current public state, expose allowed actions, and show how policy-gated execution is meant to work.
                It should be read as a testnet control surface and observability layer, not as proof of production autonomy.
              </p>
            </div>
            <div className="grid gap-4 px-8 py-8 md:grid-cols-3">
              <div className="rounded-2xl border border-border bg-surface/70 p-5">
                <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink/45">Strongest Evidence</p>
                <p className="mt-3 text-sm leading-6 text-ink/72">
                  Live AI brief output, public action catalog, and onchain-linked settlement context sourced from the public testnet.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-surface/70 p-5">
                <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink/45">What It Is Not</p>
                <p className="mt-3 text-sm leading-6 text-ink/72">
                  Not proof of production-safe agent autonomy, not proof of institutional custody controls, and not a claim that all actions are open.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-surface/70 p-5">
                <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink/45">Open Work</p>
                <p className="mt-3 text-sm leading-6 text-ink/72">
                  Stronger evaluation, security review, operational controls, and clearer policy boundaries before broader production use.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-ink p-8 text-white shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-white/45">Current Snapshot</p>
                <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">Live testnet intelligence</h2>
              </div>
              <Brain className="h-6 w-6 text-blue-300" />
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/45">Mode</p>
                <p className="mt-2 break-words text-sm font-semibold">{mode}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/45">Onchain state</p>
                <p className="mt-2 text-sm font-semibold">{onchain.ready ? "reported ready" : "not confirmed"}</p>
              </div>
            </div>
            <div className="mt-6 space-y-2 font-mono text-sm text-white/72">
              <p>full-loop routes: {routeSummary.full_loop_tested ?? "-"}/{routeSummary.routes ?? "-"}</p>
              <p>automatic routes: {routeSummary.automatic_loop_ready ?? "-"}/{routeSummary.routes ?? "-"}</p>
              <p>minted deposits: {bridgeStats.minted_deposits ?? "-"}</p>
              <p>released withdrawals: {bridgeStats.released_withdrawals ?? "-"}</p>
              <p>AI jobs: {aiStats.total_jobs ?? "-"}</p>
              <p>AI payments: {aiStats.total_payments ?? "-"}</p>
            </div>
            <Button onClick={refreshBrief} variant="klein" className="mt-8 w-full justify-between rounded-xl">
              Refresh Context
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-border bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink/45">Ask YNX</p>
                <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink">Context-aware prompt surface</h2>
              </div>
              <Bot className="h-5 w-5 text-klein" />
            </div>
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              className="mt-8 min-h-36 w-full resize-y rounded-[1.5rem] border border-border bg-surface/65 px-5 py-4 text-sm leading-6 text-ink outline-none focus:border-klein"
            />
            <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-ink/55">{status}</p>
              <Button onClick={ask} disabled={busy} variant="klein" className="rounded-xl">
                {busy ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Ask
              </Button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-white p-8 shadow-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-klein" />
              <div>
                <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink/45">Answer</p>
                <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink">Latest returned brief</h2>
              </div>
            </div>
            <div className="mt-8 space-y-3 text-sm leading-7 text-ink/75">
              {answerLines.length > 0 ? answerLines.map((line, index) => <p key={`${line}-${index}`}>{line}</p>) : <p>No answer loaded yet.</p>}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-border bg-white p-8 shadow-sm">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink/45">Public Actions</p>
                <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink">Exposed action catalog</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/60">
                  These are the actions publicly exposed through the gateway. Protected flows are still expected to sit behind policy and session controls.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <ShieldCheck className="h-4 w-4" />
                policy gated
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {publicActions.map((action) => {
                const item = actionMap.get(action);
                return (
                  <button
                    key={action}
                    onClick={() => void runAction(action)}
                    disabled={Boolean(actionBusy)}
                    className="flex min-h-28 items-start justify-between gap-3 rounded-[1.5rem] border border-border bg-surface/60 p-4 text-left transition hover:border-klein/35 hover:bg-white disabled:cursor-wait disabled:opacity-70"
                  >
                    <span>
                      <span className="block font-semibold text-ink">{item?.title || action}</span>
                      <span className="mt-1 block text-xs leading-5 text-ink/55">{item?.description || "Run YNX AI action."}</span>
                      <span className="mt-3 inline-flex rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase text-ink/55">
                        {item?.auth || "public"}
                      </span>
                    </span>
                    {actionBusy === action ? <RefreshCw className="h-5 w-5 animate-spin text-klein" /> : <Play className="h-5 w-5 text-klein" />}
                  </button>
                );
              })}
            </div>
            <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-ink p-4 text-white">
              <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-white/45">{actionStatus}</p>
              <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap break-words text-xs leading-6 text-white/75">
                {actionResult || "Run an action to inspect live public output."}
              </pre>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-white p-8 shadow-sm">
            <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink/45">Bridge Phase Context</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink">What the AI layer is seeing</h2>
            <div className="mt-8 grid gap-3">
              {routeItems.map((route) => (
                <div key={route.routeId} className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface/60 p-4">
                  <div>
                    <p className="font-semibold text-ink">{route.routeId}</p>
                    <p className="mt-1 font-mono text-xs text-ink/55">{route.phase}</p>
                    <p className="mt-1 font-mono text-xs text-ink/45">automatic {route.automatic_loop_ready ? "ready" : "pending"}</p>
                  </div>
                  {route.full_loop_tested ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : null}
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
              AI summaries and actions are grounded in public-testnet data. They should not be read as proof that unrestricted autonomous execution is safe for production or approved for real-value activity.
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
