import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Bot, Brain, CheckCircle2, Play, RefreshCw, Send, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";
import { countDepositTested, countReleaseObserved, summarizeRoutePhase } from "../lib/routeReadiness";
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
          deposit_tested?: number;
          release_evidence_observed?: number;
          release_observed?: number;
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

type ChatStreamEvent =
  | { type: "meta"; requestId: string; status?: string; mode?: string; llm_error?: string | null }
  | { type: "delta"; requestId: string; delta: string; done?: boolean }
  | { type: "done"; requestId: string; done: true }
  | { type: "error"; requestId: string; status?: number; message: string };

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
  const answerRef = useRef<HTMLDivElement | null>(null);
  const activeRequestRef = useRef<string>("");
  const streamAbortRef = useRef<AbortController | null>(null);
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
    streamAbortRef.current?.abort();
    const abortController = new AbortController();
    streamAbortRef.current = abortController;
    setBusy(true);
    setAnswer("");
    setStatus("Streaming live YNX context...");
    try {
      const response = await fetch("/api/ai/chat/stream", {
        method: "POST",
        headers: { "content-type": "application/json" },
        signal: abortController.signal,
        body: JSON.stringify({ message: question }),
      });
      if (!response.ok || !response.body) throw new Error(`chat ${response.status}`);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          const event = JSON.parse(line) as ChatStreamEvent;

          if (event.type === "meta") {
            activeRequestRef.current = event.requestId;
            if (event.mode) setMode(event.mode);
            if (event.llm_error) setStatus(`Live fallback: ${event.llm_error}`);
            continue;
          }

          if (event.requestId !== activeRequestRef.current) continue;

          if (event.type === "delta") {
            setAnswer((current) => current + event.delta);
            setStatus("Streaming answer...");
            continue;
          }

          if (event.type === "done") {
            setStatus("Answer updated");
            continue;
          }

          if (event.type === "error") {
            throw new Error(event.message);
          }
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        setStatus("Previous stream cancelled");
      } else {
        setStatus(error instanceof Error ? error.message : "AI chat unavailable");
      }
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
  const routeTotal = routeSummary.routes ?? routeItems.length ?? 0;
  const depositTested = countDepositTested(routeItems);
  const releaseObserved = countReleaseObserved(routeItems);
  const answerLines = useMemo(() => answer.split(/\n/).filter((line) => line.trim().length > 0), [answer]);
  const canAsk = Boolean(question.trim()) && !busy;
  const publicActions = ["assets.list", "validators.status", "bridge.readiness", "trade.quote", "trade.preflight", "trade.prepare", "trade.execute", "tx.latest"];
  const actionMap = useMemo(() => new Map(actions.map((item) => [item.action, item])), [actions]);
  const examplePrompts = [
    "What can I try first on YNX?",
    "Explain bridge readiness in plain English.",
    "What still blocks a stronger production claim?",
  ];

  function handlePromptKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) return;
    event.preventDefault();
    if (canAsk) void ask();
  }

  useEffect(() => {
    if (!answer) return;
    answerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [answer]);

  useEffect(() => {
    return () => {
      streamAbortRef.current?.abort();
    };
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-28">
      <main className="mx-auto max-w-7xl px-6">
        <section className="grid gap-8 py-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="overflow-hidden rounded-[2rem] border border-border bg-white shadow-sm">
            <div className="ynx-mesh border-b border-border px-8 py-9">
              <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-ink/45">Public Intelligence Layer</p>
              <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">
                Ask the live YNX AI before you touch the bridge, assets, or docs.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-ink/68 md:text-lg">
                This page is the shortest user path into YNX: ask a question, read the current testnet state, then jump into the right action.
                The AI is grounded in public-testnet context, not positioned as production autonomy.
              </p>
            </div>
            <div className="grid gap-4 px-8 py-7 md:grid-cols-3">
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
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">Live testnet context</h2>
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
              <p>deposit-tested routes: {routeSummary.deposit_tested ?? depositTested}/{routeTotal || "-"}</p>
              <p>routes with release proof: {routeSummary.release_evidence_observed ?? routeSummary.release_observed ?? releaseObserved}/{routeTotal || "-"}</p>
              <p>automatic routes: {routeSummary.automatic_loop_ready ?? "-"}/{routeTotal || "-"}</p>
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

        <section className="grid items-start gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2.25rem] border border-klein/15 bg-white p-7 shadow-[0_22px_80px_rgba(0,47,167,0.08)] md:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-klein/65">Try the AI</p>
                <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink">Ask YNX Intelligence</h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-ink/58">
                  Press Enter to ask. Use Shift+Enter for a new line. The Ask button stays for mouse and mobile users.
                </p>
              </div>
              <div className="rounded-2xl bg-klein/8 p-3 text-klein">
                <Bot className="h-6 w-6" />
              </div>
            </div>
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={handlePromptKeyDown}
              placeholder="Ask what you should try, what is live, or what still blocks production readiness..."
              className="mt-7 min-h-44 w-full resize-y rounded-[1.75rem] border border-klein/12 bg-[linear-gradient(180deg,#ffffff_0%,#f7faff_100%)] px-5 py-4 text-base leading-7 text-ink outline-none transition focus:border-klein/45 focus:shadow-[0_0_0_4px_rgba(0,47,167,0.08)]"
            />
            <div className="mt-4 flex flex-wrap gap-2">
              {examplePrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setQuestion(prompt)}
                  className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-ink/58 transition hover:border-klein/25 hover:text-klein"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-ink/55">{status}</p>
              <Button onClick={ask} disabled={!canAsk} variant="klein" className="rounded-2xl px-6">
                {busy ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Ask
              </Button>
            </div>
          </div>

          <div className="rounded-[2.25rem] border border-border bg-white p-7 shadow-sm md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink/45">Answer</p>
                <h2 className="mt-1 font-display text-4xl font-semibold tracking-tight text-ink">Latest answer</h2>
                <p className="mt-3 text-sm leading-6 text-ink/55">
                  Long answers stay readable here. Scroll inside this panel without losing the prompt.
                </p>
              </div>
              <Sparkles className="h-6 w-6 shrink-0 text-klein" />
            </div>
            <div
              ref={answerRef}
              className="mt-7 max-h-[42rem] min-h-[26rem] overflow-y-auto rounded-[1.75rem] border border-border bg-surface/55 px-5 py-5 text-base leading-8 text-ink/76 shadow-inner"
            >
              <div className="space-y-4 pr-1">
              {answerLines.length > 0 ? answerLines.map((line, index) => <p key={`${line}-${index}`}>{line}</p>) : <p>No answer loaded yet.</p>}
              </div>
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
                    <p className="mt-1 font-mono text-xs text-ink/55">{summarizeRoutePhase(route)}</p>
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
