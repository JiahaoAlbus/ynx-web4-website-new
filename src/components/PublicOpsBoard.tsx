import { Activity, AlertCircle, GitBranch, RefreshCw, ShieldCheck } from "lucide-react";
import { usePublicOps } from "../hooks/usePublicOps";

function blockerLabel(raw: string) {
  return raw.replaceAll("_", " ");
}

export function PublicOpsBoard() {
  const { snapshot, loading, error, refresh } = usePublicOps();

  const validator = snapshot?.validator;
  const validatorsReady = validator?.bonded_count ?? null;
  const validatorsSigned = validator?.signed_count ?? null;
  const routeTotal = snapshot?.routes.total ?? 5;
  const depositTested = snapshot?.routes.deposit_tested ?? null;
  const releaseObserved = snapshot?.routes.release_observed ?? null;
  const depositWatchersLive = snapshot?.routes.deposit_watchers_live ?? null;
  const automatic = snapshot?.routes.automatic_loop_ready ?? null;
  const blockers = snapshot?.routes.blockers ?? [];

  const validatorTarget = validator?.min_validators ?? 4;
  const validatorsReadyValue = validatorsReady === null ? `—/${validatorTarget}` : `${validatorsReady}/${validatorTarget}`;
  const depositTestedValue = depositTested === null ? `—/${routeTotal}` : `${depositTested}/${routeTotal}`;
  const releaseObservedValue = releaseObserved === null ? `—/${routeTotal}` : `${releaseObserved}/${routeTotal}`;

  const cards = [
    {
      label: "Bonded validators",
      value: validatorsReadyValue,
      tone: validatorsReady !== null && validatorsReady >= validatorTarget ? "emerald" : "amber",
      icon: <ShieldCheck className="h-4 w-4" />,
      detail: validator
        ? `${validator.unjailed_count} unjailed, ${validatorsSigned ?? 0}/${validator.indexer_total || validator.bonded_count} signed`
        : "Checking live validator gate",
    },
    {
      label: "Routes with deposit proof",
      value: depositTestedValue,
      tone: depositTested !== null && depositTested >= Math.max(1, routeTotal - 1) ? "emerald" : "amber",
      icon: <GitBranch className="h-4 w-4" />,
      detail:
        releaseObserved === null
          ? "Checking public bridge route evidence"
          : `${releaseObserved}/${routeTotal} routes already show release proof on the public bridge`,
    },
    {
      label: "Routes with release proof",
      value: releaseObservedValue,
      tone: releaseObserved !== null && releaseObserved >= Math.max(1, routeTotal - 1) ? "emerald" : "amber",
      icon: <Activity className="h-4 w-4" />,
      detail:
        automatic === null || depositWatchersLive === null
          ? "Checking automatic release and watcher coverage"
          : `${automatic}/${routeTotal} routes are fully automatic today; ${depositWatchersLive}/${routeTotal} already have live deposit watchers`,
    },
  ];

  function toneClasses(tone: string) {
    if (tone === "emerald") return "bg-emerald-50 text-emerald-700 border-emerald-100";
    if (tone === "amber") return "bg-amber-50 text-amber-700 border-amber-100";
    return "bg-rose-50 text-rose-700 border-rose-100";
  }

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink/45">Public Operations</p>
          <h3 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink">The shortest live proof board</h3>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/60">
            This board is designed to show the fastest things a serious user can verify: validator quorum, deposit and release proof,
            and the exact blockers still stopping a stronger automatic-release claim.
          </p>
        </div>
        <button
          onClick={refresh}
          className="rounded-full border border-border p-2 text-ink/45 transition hover:border-klein/30 hover:text-klein"
          title="Refresh"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-[1.5rem] border border-border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink/45">{card.label}</span>
              <span className={`rounded-lg border px-2 py-1 ${toneClasses(card.tone)}`}>{card.icon}</span>
            </div>
            <p className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink">{card.value}</p>
            <p className="mt-2 text-sm leading-6 text-ink/60">{card.detail}</p>
          </div>
        ))}
      </div>

      <div className="rounded-[2rem] border border-border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <h4 className="text-sm font-semibold text-ink">What still blocks wider automatic release</h4>
        </div>
        <p className="mt-2 text-sm leading-6 text-ink/60">
          These are the concrete remaining blockers. They explain why several routes are already live and testable today, but still not yet automatic end to end.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {blockers.map((item) => (
            <div key={item.routeId} className="rounded-2xl border border-border bg-surface/60 p-4">
              <p className="text-sm font-semibold text-ink">{item.displayName}</p>
              <p className="mt-1 text-[11px] font-mono uppercase tracking-[0.18em] text-ink/45">{item.routeId}</p>
              <div className="mt-3 space-y-1 text-sm text-ink/70">
                <p>deposit: {item.depositStatus}</p>
                <p>release: {item.releaseStatus}</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.blockers.map((blocker) => (
                  <span key={blocker} className="rounded-lg border border-amber-200 bg-amber-50 px-2 py-1 text-xs text-amber-700">
                    {blockerLabel(blocker)}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        {error ? <p className="mt-4 text-xs text-rose-500">Connection warning: {error}</p> : null}
      </div>
    </section>
  );
}
