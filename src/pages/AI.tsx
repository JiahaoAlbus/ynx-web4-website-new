import { useEffect, useMemo, useState } from "react";
import { Bot, Brain, CheckCircle2, ListChecks, Play, RefreshCw, Send, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";

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
          mapped_route_only?: number;
        };
        items?: Array<{ routeId: string; phase: string; full_loop_tested?: boolean }>;
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
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} ${response.status}`);
  return response.json();
}

export function AI() {
  const [brief, setBrief] = useState<IntelligenceBrief | null>(null);
  const [question, setQuestion] = useState("我们现在 AI、跨链和交易主线状态怎么样？下一步应该优先做什么？");
  const [answer, setAnswer] = useState("");
  const [mode, setMode] = useState("-");
  const [status, setStatus] = useState("Loading YNX Intelligence...");
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
    setStatus("Thinking with live YNX context...");
    try {
      const response = await fetch(AI_CHAT_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
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
      const response = await fetch(AI_ACTION_RUN_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action }),
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
  const publicActions = ["assets.list", "validators.status", "bridge.readiness", "tx.latest"];
  const actionMap = useMemo(() => new Map(actions.map((item) => [item.action, item])), [actions]);

  return (
    <div className="min-h-screen pt-24 pb-24">
      <main className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[380px_1fr]">
        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-ink p-6 text-white shadow-xl">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-white/45">YNX Intelligence</p>
                <h1 className="mt-2 text-3xl font-display font-bold tracking-tight">AI Console</h1>
              </div>
              <Brain className="text-emerald-300" />
            </div>
            <p className="text-sm leading-6 text-white/65">
              Live chain, bridge, trading, Web4, and AI settlement context from the public testnet.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white/5 p-3">
                <p className="text-xs font-mono uppercase text-white/40">Mode</p>
                <p className="mt-1 break-words text-sm font-semibold">{mode}</p>
              </div>
              <div className="rounded-xl bg-white/5 p-3">
                <p className="text-xs font-mono uppercase text-white/40">On-chain</p>
                <p className="mt-1 text-sm font-semibold">{onchain.ready ? "Ready" : "-"}</p>
              </div>
            </div>
            <Button onClick={refreshBrief} variant="klein" className="mt-6 w-full rounded-xl">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Context
            </Button>
          </div>

          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <p className="text-xs font-mono uppercase tracking-widest text-ink/45">Live Stats</p>
            <div className="mt-4 space-y-2 font-mono text-sm text-ink/70">
              <p>routes full-loop: {routeSummary.full_loop_tested ?? "-"}/{routeSummary.routes ?? "-"}</p>
              <p>minted deposits: {bridgeStats.minted_deposits ?? "-"}</p>
              <p>released withdrawals: {bridgeStats.released_withdrawals ?? "-"}</p>
              <p>AI jobs: {aiStats.total_jobs ?? "-"}</p>
              <p>AI payments: {aiStats.total_payments ?? "-"}</p>
            </div>
          </div>
        </aside>

        <section className="space-y-6">
          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-ink/45">Ask YNX</p>
                <h2 className="mt-1 font-display text-2xl font-semibold">Network Intelligence</h2>
              </div>
              <Bot className="text-klein" />
            </div>
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              className="min-h-32 w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 text-sm leading-6 text-ink outline-none focus:border-klein"
            />
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-ink/55">{status}</p>
              <Button onClick={ask} disabled={busy} variant="klein" className="rounded-xl">
                {busy ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Ask
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-klein" />
              <p className="font-display text-xl font-semibold">Answer</p>
            </div>
            <div className="space-y-3 text-sm leading-6 text-ink/75">
              {answerLines.map((line, index) => (
                <p key={`${line}-${index}`}>{line}</p>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <ListChecks className="h-5 w-5 text-klein" />
                  <p className="font-display text-xl font-semibold">AI Actions</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-ink/60">
                  Run live public actions directly from the YNX AI Gateway. Protected actions stay behind Web4 policy/session controls.
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
                    className="flex min-h-24 items-start justify-between gap-3 rounded-xl border border-border bg-surface p-4 text-left transition hover:border-klein/40 hover:bg-white disabled:cursor-wait disabled:opacity-70"
                  >
                    <span>
                      <span className="block font-semibold text-ink">{item?.title || action}</span>
                      <span className="mt-1 block text-xs leading-5 text-ink/55">{item?.description || "Run YNX AI action."}</span>
                    </span>
                    {actionBusy === action ? <RefreshCw className="h-5 w-5 animate-spin text-klein" /> : <Play className="h-5 w-5 text-klein" />}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 rounded-xl border border-border bg-ink p-4 text-white">
              <p className="text-xs font-mono uppercase tracking-widest text-white/45">{actionStatus}</p>
              <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap break-words text-xs leading-5 text-white/75">
                {actionResult || "Run an action to inspect live YNX data."}
              </pre>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <p className="text-xs font-mono uppercase tracking-widest text-ink/45">Route Phases</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {routeItems.map((route) => (
                <div key={route.routeId} className="flex items-center justify-between gap-3 rounded-xl bg-surface p-3">
                  <div>
                    <p className="font-semibold text-ink">{route.routeId}</p>
                    <p className="mt-1 font-mono text-xs text-ink/55">{route.phase}</p>
                  </div>
                  {route.full_loop_tested && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
