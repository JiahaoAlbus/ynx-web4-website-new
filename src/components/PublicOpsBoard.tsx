import { Activity, AlertCircle, GitBranch, RefreshCw, ShieldCheck } from "lucide-react";
import { usePublicOps } from "../hooks/usePublicOps";
import { useTranslation, type Locale } from "../contexts/LanguageContext";

const opsCopy = {
  en: {
    eyebrow: "Public Operations",
    title: "The shortest live proof board",
    intro:
      "This board is designed to show the fastest things a serious user can verify: validator quorum, deposit and release proof, and the exact blockers still stopping a stronger automatic-release claim. Release proof is broader than automatic release.",
    refresh: "Refresh",
    cards: {
      validators: "Bonded validators",
      validatorChecking: "Checking live validator gate",
      validatorDetail: (unjailed: number, signed: number, total: number) => `${unjailed} unjailed, ${signed}/${total} signed`,
      depositProof: "Routes with deposit proof",
      depositChecking: "Checking public bridge route evidence",
      depositDetail: (a: number, b: number) => `${a}/${b} routes already show deposit-tested evidence on the public bridge`,
      releaseProof: "Routes with any release proof",
      releaseChecking: "Checking automatic release and watcher coverage",
      releaseDetail: (automatic: number, total: number, watchers: number) =>
        `${automatic}/${total} routes are fully automatic today; ${watchers}/${total} already have live deposit watchers. This proof bucket can include manual operator-marked release evidence.`,
    },
    blockersTitle: "What still blocks wider automatic release",
    blockersIntro:
      "These are the concrete remaining blockers. They explain why several routes are already live and testable today, but still not yet automatic end to end.",
    deposit: "deposit",
    release: "release",
    connectionWarning: "Connection warning",
  },
  zh: {
    eyebrow: "公共运营",
    title: "最短的实时证据板",
    intro:
      "这个面板展示严肃用户最快能核验的内容：验证者法定人数、充值和释放证据，以及仍然阻止更强自动释放声明的具体阻塞项。释放证据不等于自动释放。",
    refresh: "刷新",
    cards: {
      validators: "担保验证者",
      validatorChecking: "正在检查实时验证者门禁",
      validatorDetail: (unjailed: number, signed: number, total: number) => `${unjailed} 人未被监禁，${signed}/${total} 人签名`,
      depositProof: "有充值证明的路线",
      depositChecking: "正在检查公开 bridge 路线证据",
      depositDetail: (a: number, b: number) => `${a}/${b} 条路线已经在公开 bridge 上显示 deposit-tested 证据`,
      releaseProof: "有任意释放证明的路线",
      releaseChecking: "正在检查自动释放和 watcher 覆盖",
      releaseDetail: (automatic: number, total: number, watchers: number) =>
        `今天 ${automatic}/${total} 条路线完全自动；${watchers}/${total} 条路线已有实时 deposit watcher。这个证明桶也可能包含人工运营者标记的释放证据。`,
    },
    blockersTitle: "仍然阻止更广泛自动释放的因素",
    blockersIntro: "这些是当前仍存在的具体阻塞项。它们解释了为什么部分路线今天已经可用、可测试，但还没有端到端自动化。",
    deposit: "充值",
    release: "释放",
    connectionWarning: "连接警告",
  },
  ja: {
    eyebrow: "公開オペレーション",
    title: "最短のライブ証拠ボード",
    intro: "このボードは、validator quorum、deposit/release proof、automatic-release claim を止めている具体的な blockers を素早く検証するためのものです。Release proof は automatic release より広い概念です。",
    refresh: "更新",
    cards: {
      validators: "Bonded validators",
      validatorChecking: "validator gate を確認中",
      validatorDetail: (unjailed: number, signed: number, total: number) => `${unjailed} unjailed, ${signed}/${total} signed`,
      depositProof: "Deposit proof routes",
      depositChecking: "bridge route evidence を確認中",
      depositDetail: (a: number, b: number) => `${a}/${b} routes に deposit-tested evidence があります`,
      releaseProof: "Release proof routes",
      releaseChecking: "automatic release と watcher coverage を確認中",
      releaseDetail: (automatic: number, total: number, watchers: number) =>
        `${automatic}/${total} routes are fully automatic today; ${watchers}/${total} have live deposit watchers.`,
    },
    blockersTitle: "Automatic release を止めているもの",
    blockersIntro: "これらは現在残っている具体的な blockers です。いくつかの route は live/testable ですが、まだ end-to-end automatic ではありません。",
    deposit: "deposit",
    release: "release",
    connectionWarning: "接続警告",
  },
  ko: {
    eyebrow: "공개 운영",
    title: "가장 짧은 실시간 증거 보드",
    intro: "이 보드는 validator quorum, deposit/release proof, automatic-release claim을 막는 구체적 blocker를 빠르게 확인하기 위한 것입니다. Release proof는 automatic release보다 넓은 개념입니다.",
    refresh: "새로고침",
    cards: {
      validators: "Bonded validators",
      validatorChecking: "validator gate 확인 중",
      validatorDetail: (unjailed: number, signed: number, total: number) => `${unjailed} unjailed, ${signed}/${total} signed`,
      depositProof: "Deposit proof routes",
      depositChecking: "bridge route evidence 확인 중",
      depositDetail: (a: number, b: number) => `${a}/${b} routes가 deposit-tested evidence를 보여줍니다`,
      releaseProof: "Release proof routes",
      releaseChecking: "automatic release 및 watcher coverage 확인 중",
      releaseDetail: (automatic: number, total: number, watchers: number) =>
        `오늘 ${automatic}/${total} routes가 fully automatic이고, ${watchers}/${total} routes에는 live deposit watchers가 있습니다.`,
    },
    blockersTitle: "Automatic release를 막는 요소",
    blockersIntro: "현재 남아 있는 구체적 blocker입니다. 일부 route는 live/testable이지만 아직 end-to-end automatic은 아닙니다.",
    deposit: "deposit",
    release: "release",
    connectionWarning: "연결 경고",
  },
  es: {
    eyebrow: "Operaciones públicas",
    title: "El tablero de prueba en vivo más corto",
    intro:
      "Este tablero muestra lo más rápido que un usuario serio puede verificar: quórum de validadores, pruebas de depósito y release, y blockers exactos que aún frenan una afirmación más fuerte de automatic release.",
    refresh: "Actualizar",
    cards: {
      validators: "Validadores bonded",
      validatorChecking: "Comprobando gate de validadores",
      validatorDetail: (unjailed: number, signed: number, total: number) => `${unjailed} unjailed, ${signed}/${total} signed`,
      depositProof: "Rutas con prueba de depósito",
      depositChecking: "Comprobando evidencia pública del bridge",
      depositDetail: (a: number, b: number) => `${a}/${b} rutas ya muestran evidencia deposit-tested`,
      releaseProof: "Rutas con prueba de release",
      releaseChecking: "Comprobando automatic release y watcher coverage",
      releaseDetail: (automatic: number, total: number, watchers: number) =>
        `${automatic}/${total} rutas son fully automatic hoy; ${watchers}/${total} ya tienen live deposit watchers.`,
    },
    blockersTitle: "Qué bloquea un automatic release más amplio",
    blockersIntro: "Estos son los blockers concretos restantes. Explican por qué varias rutas ya son live y testables, pero aún no automatic end to end.",
    deposit: "depósito",
    release: "release",
    connectionWarning: "Aviso de conexión",
  },
} as const;

function copyFor(locale: Locale) {
  return opsCopy[locale] || opsCopy.en;
}

function blockerLabel(raw: string, locale: Locale) {
  const value = raw.replaceAll("_", " ");
  if (locale === "zh") {
    return (
      {
        "release pending signer": "release 签名者待处理",
        "source lockbox unconfigured": "源链 lockbox 未配置",
        "release adapter disabled": "release adapter 已禁用",
      }[value] || value
    );
  }
  if (locale === "es") {
    return (
      {
        "release pending signer": "signer de release pendiente",
        "source lockbox unconfigured": "source lockbox no configurado",
        "release adapter disabled": "release adapter deshabilitado",
      }[value] || value
    );
  }
  return value;
}

function statusLabel(raw: string, locale: Locale) {
  if (locale === "zh") {
    return (
      {
        "deposit tested": "充值已测试",
        "manual proof, watcher live": "人工证明，监听器在线",
        "manual proof observed": "已观察到人工证明",
        "watcher live": "监听器在线",
        "automatic release ready": "自动释放就绪",
        "release observed, adapter disabled": "已观察到释放，adapter 禁用",
        "release observed, signer pending": "已观察到释放，签名者待处理",
        "release observed, lockbox pending": "已观察到释放，lockbox 待处理",
        "release observed": "已观察到释放",
        pending: "待处理",
      }[raw] || raw
    );
  }
  if (locale === "es") {
    return (
      {
        "deposit tested": "depósito probado",
        "watcher live": "watcher activo",
        "automatic release ready": "automatic release listo",
        "release observed, signer pending": "release observado, signer pendiente",
        "release observed, lockbox pending": "release observado, lockbox pendiente",
        "release observed": "release observado",
        pending: "pendiente",
      }[raw] || raw
    );
  }
  return raw;
}

export function PublicOpsBoard() {
  const { locale } = useTranslation();
  const copy = copyFor(locale);
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
      label: copy.cards.validators,
      value: validatorsReadyValue,
      tone: validatorsReady !== null && validatorsReady >= validatorTarget ? "emerald" : "amber",
      icon: <ShieldCheck className="h-4 w-4" />,
      detail: validator
        ? copy.cards.validatorDetail(validator.unjailed_count, validatorsSigned ?? 0, validator.indexer_total || validator.bonded_count)
        : copy.cards.validatorChecking,
    },
    {
      label: copy.cards.depositProof,
      value: depositTestedValue,
      tone: depositTested !== null && depositTested >= Math.max(1, routeTotal - 1) ? "emerald" : "amber",
      icon: <GitBranch className="h-4 w-4" />,
      detail:
        depositTested === null
          ? copy.cards.depositChecking
          : copy.cards.depositDetail(depositTested, routeTotal),
    },
    {
      label: copy.cards.releaseProof,
      value: releaseObservedValue,
      tone: releaseObserved !== null && releaseObserved >= Math.max(1, routeTotal - 1) ? "emerald" : "amber",
      icon: <Activity className="h-4 w-4" />,
      detail:
        automatic === null || depositWatchersLive === null
          ? copy.cards.releaseChecking
          : copy.cards.releaseDetail(automatic, routeTotal, depositWatchersLive),
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
          <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink/45">{copy.eyebrow}</p>
          <h3 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink">{copy.title}</h3>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/60">
            {copy.intro}
          </p>
        </div>
        <button
          onClick={refresh}
          className="rounded-full border border-border p-2 text-ink/45 transition hover:border-klein/30 hover:text-klein"
          title={copy.refresh}
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
          <h4 className="text-sm font-semibold text-ink">{copy.blockersTitle}</h4>
        </div>
        <p className="mt-2 text-sm leading-6 text-ink/60">
          {copy.blockersIntro}
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {blockers.map((item) => (
            <div key={item.routeId} className="rounded-2xl border border-border bg-surface/60 p-4">
              <p className="text-sm font-semibold text-ink">{item.displayName}</p>
              <p className="mt-1 text-[11px] font-mono uppercase tracking-[0.18em] text-ink/45">{item.routeId}</p>
              <div className="mt-3 space-y-1 text-sm text-ink/70">
                <p>{copy.deposit}: {statusLabel(item.depositStatus, locale)}</p>
                <p>{copy.release}: {statusLabel(item.releaseStatus, locale)}</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.blockers.map((blocker) => (
                  <span key={blocker} className="rounded-lg border border-amber-200 bg-amber-50 px-2 py-1 text-xs text-amber-700">
                    {blockerLabel(blocker, locale)}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        {error ? <p className="mt-4 text-xs text-rose-500">{copy.connectionWarning}: {error}</p> : null}
      </div>
    </section>
  );
}
