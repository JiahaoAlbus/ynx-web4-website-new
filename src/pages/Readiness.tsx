import { useEffect, useMemo, useState } from "react";
import { Activity, AlertTriangle, CheckCircle2, ExternalLink, RefreshCw, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useTranslation, type Locale } from "../contexts/LanguageContext";
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

const readinessCopy = {
  en: {
    loading: "Loading readiness evidence...",
    refreshed: "Live evidence refreshed",
    unavailable: "Readiness evidence unavailable",
    eyebrow: "Mainnet-Candidate Discipline",
    title: "Readiness is framed as gates, not a marketing adjective.",
    intro:
      "This page collects live public evidence for route health, watcher automation, and release behavior. A green status here means a testnet rehearsal gate appears satisfied. It does not by itself convert YNX into a launched production system.",
    strongestEvidence: "Strongest Evidence",
    strongestEvidenceText: "Live watcher scans, route mappings, minted deposits, and released withdrawals on public test assets.",
    notProven: "Not Proven Here",
    notProvenText: "No external audit, no institutional signing controls evidence, and no legal/compliance sign-off is proven by these JSON feeds.",
    nextThreshold: "Next Threshold",
    nextThresholdText: "Turn route rehearsal into externally reviewable operational maturity with independent operators and stronger controls.",
    gateScore: "Gate Score",
    gateScoreText:
      "The score is a compact summary of rehearsal completeness. It should be read alongside the failed gates and remaining blockers, not as a binary claim that YNX is production-ready.",
    refresh: "Refresh Evidence",
    rawJson: "Open Raw JSON",
    remainingGaps: "Remaining gap categories: external audit, production signing controls, durable independent validator operations, and formal legal structure.",
    bridgeHealth: "Bridge Health",
    operationalCounters: "Operational counters",
    routeReadiness: "Route Readiness",
    perRouteEvidence: "Per-route evidence",
    depositTested: "deposit tested",
    minted: "minted",
    released: "released",
    deposit: "deposit",
    release: "release",
    automaticLoop: "automatic loop",
    ready: "ready",
    pending: "pending",
    watchers: "Watchers",
    scanTraces: "Deposit and withdrawal scan traces",
    block: "block",
    queued: "queued",
    routeMapping: "Route Mapping",
    gatewayChecks: "Gateway integrity checks",
    ok: "ok",
    fail: "fail",
    disciplineNotice:
      "This page argues for mainnet-candidate discipline, not finished production status. Real mainnet status still requires external audits, independent operators, production signing and custody controls, and formal legal/compliance work.",
    links: {
      assetsTitle: "Test Assets",
      assetsText: "Fund gas and add public test assets.",
      bridgeTitle: "Bridge",
      bridgeText: "Inspect deposit routes and current bridge surface.",
      withdrawTitle: "Withdraw",
      withdrawText: "Check burn and source-release flow.",
      rawTitle: "Raw Evidence",
      rawText: "Open live bridge health JSON.",
    },
    counters: {
      routes: "routes",
      depositWatchersLive: "deposit watchers live",
      depositTestedRoutes: "deposit-tested routes",
      routesWithReleaseEvidence: "routes with release evidence",
      mintedDeposits: "minted deposits",
      releasedWithdrawals: "released withdrawals",
      watcherPollMs: "watcher poll ms",
      withdrawalPollMs: "withdrawal poll ms",
      automaticLoops: "automatic loops",
      lastError: "last error",
    },
    gates: {
      publicServices: "Public services",
      publicServicesOk: "Bridge service JSON is responding on the public testnet.",
      publicServicesBad: "Bridge health is not currently confirmed.",
      depositWatcher: "Automated deposit watcher",
      depositWatcherDetail: (a: number, b: number) => `${a}/${b} routes show live deposit-watcher evidence.`,
      mapping: "Route mapping integrity",
      mappingOk: "Configured wrapped-token mappings match the gateway.",
      mappingBad: "One or more route mappings need attention.",
      depositRoutes: "Deposit-tested routes",
      depositRoutesDetail: (a: number, b: number) => `${a}/${b} routes show public deposit evidence today.`,
      releaseRoutes: "Routes with release evidence",
      releaseRoutesDetail: (a: number, b: number) => `${a}/${b} routes show observed release evidence, even when release remains partially manual.`,
      automaticRelease: "Automatic release readiness",
      automaticReleaseOk: "At least one route reports stronger automatic-release readiness.",
      automaticReleaseBad: "Automatic release is still blocked by missing signer, lockbox, or release-enable configuration.",
    },
  },
  zh: {
    loading: "正在加载 readiness 证据...",
    refreshed: "实时证据已刷新",
    unavailable: "readiness 证据暂不可用",
    eyebrow: "主网候选纪律",
    title: "Readiness 应该是门禁，不是营销形容词。",
    intro:
      "本页汇总路线健康、监听器自动化和释放行为的公开实时证据。这里的绿色状态只代表测试网演练门禁看起来满足，并不等于 YNX 已经成为正式生产系统。",
    strongestEvidence: "最强证据",
    strongestEvidenceText: "公开测试资产上的实时 watcher 扫描、路线映射、minted deposits 和 released withdrawals。",
    notProven: "这里没有证明什么",
    notProvenText: "这些 JSON feed 不能证明外部审计、机构级签名控制，也不能证明法律/合规 sign-off 已完成。",
    nextThreshold: "下一道门槛",
    nextThresholdText: "把路线演练推进到外部可审查的运营成熟度：独立运营者和更强控制。",
    gateScore: "门禁分数",
    gateScoreText: "这个分数只是演练完整度摘要，要和失败门禁、剩余阻塞项一起看，不能当成 YNX 已 production-ready 的二元结论。",
    refresh: "刷新证据",
    rawJson: "打开原始 JSON",
    remainingGaps: "剩余缺口：外部审计、生产签名控制、稳定独立验证者运营、正式法律结构。",
    bridgeHealth: "Bridge 健康",
    operationalCounters: "运营计数器",
  routeReadiness: "路线就绪度",
    perRouteEvidence: "逐路线证据",
    depositTested: "充值已测试",
    minted: "minted",
    released: "released",
    deposit: "充值",
    release: "释放",
    automaticLoop: "自动闭环",
    ready: "就绪",
    pending: "待完成",
    watchers: "监听器",
    scanTraces: "充值与提现扫描记录",
    block: "区块",
    queued: "已排队",
    routeMapping: "路线映射",
    gatewayChecks: "Gateway 完整性检查",
    ok: "通过",
    fail: "失败",
    disciplineNotice: "本页强调主网候选纪律，而不是宣称生产完成。真正主网状态仍需要外部审计、独立运营者、生产签名/托管控制以及正式法律/合规工作。",
    links: {
      assetsTitle: "测试资产",
      assetsText: "领取 gas 并添加公开测试资产。",
      bridgeTitle: "跨链",
      bridgeText: "查看充值路线和当前 bridge 界面。",
      withdrawTitle: "提现",
      withdrawText: "检查 burn 与源链释放流程。",
      rawTitle: "原始证据",
      rawText: "打开实时 bridge health JSON。",
    },
    counters: {
      routes: "路线数",
      depositWatchersLive: "实时充值监听器",
      depositTestedRoutes: "充值已测试路线",
      routesWithReleaseEvidence: "有释放证据的路线",
      mintedDeposits: "minted deposits",
      releasedWithdrawals: "released withdrawals",
      watcherPollMs: "watcher 轮询 ms",
      withdrawalPollMs: "提现轮询 ms",
      automaticLoops: "自动闭环",
      lastError: "最后错误",
    },
    gates: {
      publicServices: "公开服务",
      publicServicesOk: "Bridge service JSON 正在公开测试网上响应。",
      publicServicesBad: "当前尚未确认 bridge health。",
      depositWatcher: "自动充值监听器",
      depositWatcherDetail: (a: number, b: number) => `${a}/${b} 条路线显示实时 deposit-watcher 证据。`,
      mapping: "路线映射完整性",
      mappingOk: "配置的 wrapped-token 映射与 gateway 匹配。",
      mappingBad: "一个或多个路线映射需要处理。",
      depositRoutes: "充值已测试路线",
      depositRoutesDetail: (a: number, b: number) => `${a}/${b} 条路线今天显示公开充值证据。`,
      releaseRoutes: "有释放证据的路线",
      releaseRoutesDetail: (a: number, b: number) => `${a}/${b} 条路线显示已观察到释放证据，即使释放仍部分人工。`,
      automaticRelease: "自动释放就绪度",
      automaticReleaseOk: "至少一条路线报告了更强的自动释放就绪度。",
      automaticReleaseBad: "自动释放仍被 signer、lockbox 或 release-enable 配置缺失阻塞。",
    },
  },
};

const readinessJa: typeof readinessCopy.en = {
  ...readinessCopy.en,
  loading: "readiness 証拠を読み込み中...",
  refreshed: "ライブ証拠を更新しました",
  unavailable: "readiness 証拠を取得できません",
  eyebrow: "メインネット候補の運用規律",
  title: "Readiness はマーケティング語ではなく、ゲートとして示します。",
  intro: "このページは、ルート健全性、watcher 自動化、release 動作の公開ライブ証拠を集約します。緑色はテストネット演習ゲートを満たしている可能性を示すだけで、YNX が本番ローンチ済みであることを意味しません。",
  strongestEvidence: "最も強い証拠",
  strongestEvidenceText: "公開テスト資産上の live watcher scan、route mapping、minted deposits、released withdrawals。",
  notProven: "ここで証明していないこと",
  notProvenText: "外部監査、機関向け署名管理、法律/コンプライアンス sign-off は、この JSON feed だけでは証明されません。",
  nextThreshold: "次のしきい値",
  nextThresholdText: "ルート演習を、独立運用者とより強い管理で外部レビュー可能な運用成熟度へ進めます。",
  gateScore: "ゲートスコア",
  gateScoreText: "このスコアは演習完成度の要約です。失敗ゲートと残ブロッカーと一緒に読むべきで、本番 ready の二値判定ではありません。",
  refresh: "証拠を更新",
  rawJson: "Raw JSON を開く",
  remainingGaps: "残るギャップ：外部監査、本番署名管理、持続的な独立 validator 運用、正式な法的構造。",
  bridgeHealth: "Bridge 健全性",
  operationalCounters: "運用カウンター",
  routeReadiness: "ルート準備状況",
  perRouteEvidence: "ルート別証拠",
  depositTested: "入金テスト済み",
  minted: "発行",
  released: "解放",
  deposit: "入金",
  release: "解放",
  automaticLoop: "自動ループ",
  ready: "準備完了",
  pending: "保留",
  watchers: "監視サービス",
  scanTraces: "入金と出金のスキャン記録",
  block: "ブロック",
  queued: "キュー済み",
  routeMapping: "ルートマッピング",
  gatewayChecks: "Gateway 整合性チェック",
  ok: "正常",
  fail: "失敗",
  disciplineNotice: "このページは mainnet-candidate discipline を示すもので、完成した production status ではありません。実際の mainnet status には外部監査、独立運用者、本番署名/カストディ管理、正式な法務/コンプライアンス作業が必要です。",
  links: {
    assetsTitle: "テスト資産",
    assetsText: "gas を取得し、公開テスト資産を追加します。",
    bridgeTitle: "ブリッジ",
    bridgeText: "入金ルートと現在のブリッジ面を確認します。",
    withdrawTitle: "出金",
    withdrawText: "burn と source-release flow を確認します。",
    rawTitle: "生の証拠",
    rawText: "ライブ bridge health JSON を開きます。",
  },
  counters: {
    routes: "ルート数",
    depositWatchersLive: "稼働中の入金監視",
    depositTestedRoutes: "入金テスト済みルート",
    routesWithReleaseEvidence: "解放証拠のあるルート",
    mintedDeposits: "発行済み入金",
    releasedWithdrawals: "解放済み出金",
    watcherPollMs: "監視ポーリング ms",
    withdrawalPollMs: "出金ポーリング ms",
    automaticLoops: "自動ループ",
    lastError: "最後のエラー",
  },
  gates: {
    publicServices: "公開サービス",
    publicServicesOk: "Bridge service JSON は公開テストネットで応答しています。",
    publicServicesBad: "Bridge health は現在確認できていません。",
    depositWatcher: "自動入金監視",
    depositWatcherDetail: (a, b) => `${a}/${b} ルートに稼働中の入金監視証拠があります。`,
    mapping: "ルートマッピング整合性",
    mappingOk: "設定済み wrapped-token mapping は gateway と一致しています。",
    mappingBad: "一つ以上の route mapping に確認が必要です。",
    depositRoutes: "入金テスト済みルート",
    depositRoutesDetail: (a, b) => `${a}/${b} ルートが公開 deposit evidence を示しています。`,
    releaseRoutes: "解放証拠のあるルート",
    releaseRoutesDetail: (a, b) => `${a}/${b} ルートが release evidence を示しています。一部はまだ manual です。`,
    automaticRelease: "自動解放の準備状況",
    automaticReleaseOk: "少なくとも一つのルートがより強い自動解放準備を報告しています。",
    automaticReleaseBad: "自動解放は signer、lockbox、または release-enable 設定不足でまだブロックされています。",
  },
};

const readinessKo: typeof readinessCopy.en = {
  ...readinessCopy.en,
  loading: "readiness 증거를 불러오는 중...",
  refreshed: "실시간 증거가 새로고침되었습니다",
  unavailable: "readiness 증거를 사용할 수 없습니다",
  eyebrow: "메인넷 후보 운영 규율",
  title: "Readiness는 마케팅 문구가 아니라 게이트로 표시합니다.",
  intro: "이 페이지는 route 상태, watcher 자동화, release 동작에 대한 공개 실시간 증거를 모읍니다. 초록 상태는 테스트넷 리허설 게이트가 만족된 것처럼 보인다는 뜻이며, YNX가 production으로 출시되었다는 뜻은 아닙니다.",
  strongestEvidence: "가장 강한 증거",
  strongestEvidenceText: "공개 테스트 자산의 live watcher scan, route mapping, minted deposits, released withdrawals.",
  notProven: "여기서 증명하지 않는 것",
  notProvenText: "외부 감사, 기관급 서명 통제, 법무/컴플라이언스 sign-off는 이 JSON feed만으로 증명되지 않습니다.",
  nextThreshold: "다음 기준",
  nextThresholdText: "독립 운영자와 더 강한 통제로 route 리허설을 외부 검토 가능한 운영 성숙도로 끌어올립니다.",
  gateScore: "게이트 점수",
  gateScoreText: "이 점수는 리허설 완성도의 요약입니다. 실패한 게이트와 남은 블로커와 함께 읽어야 하며, YNX가 production-ready라는 이진 결론이 아닙니다.",
  refresh: "증거 새로고침",
  rawJson: "Raw JSON 열기",
  remainingGaps: "남은 갭: 외부 감사, production 서명 통제, 지속 가능한 독립 validator 운영, 공식 법적 구조.",
  bridgeHealth: "Bridge 상태",
  operationalCounters: "운영 카운터",
  routeReadiness: "route 준비 상태",
  perRouteEvidence: "route별 증거",
  depositTested: "입금 테스트 완료",
  minted: "발행",
  released: "해제",
  deposit: "입금",
  release: "해제",
  automaticLoop: "자동 루프",
  ready: "준비됨",
  pending: "대기 중",
  watchers: "감시 서비스",
  scanTraces: "입금 및 출금 스캔 기록",
  block: "블록",
  queued: "대기열",
  routeMapping: "route 매핑",
  gatewayChecks: "Gateway 무결성 체크",
  ok: "정상",
  fail: "실패",
  disciplineNotice: "이 페이지는 mainnet-candidate discipline을 보여주는 것이며 production 완료 상태를 주장하지 않습니다. 실제 mainnet status에는 외부 감사, 독립 운영자, production 서명/커스터디 통제, 공식 법무/컴플라이언스 작업이 필요합니다.",
  links: {
    assetsTitle: "테스트 자산",
    assetsText: "gas를 받고 공개 테스트 자산을 추가합니다.",
    bridgeTitle: "브리지",
    bridgeText: "입금 route와 현재 bridge surface를 확인합니다.",
    withdrawTitle: "출금",
    withdrawText: "burn 및 source-release flow를 확인합니다.",
    rawTitle: "원본 증거",
    rawText: "실시간 bridge health JSON을 엽니다.",
  },
  counters: {
    routes: "route 수",
    depositWatchersLive: "실시간 입금 감시",
    depositTestedRoutes: "입금 테스트 완료 route",
    routesWithReleaseEvidence: "해제 증거가 있는 route",
    mintedDeposits: "발행된 입금",
    releasedWithdrawals: "해제된 출금",
    watcherPollMs: "감시 폴링 ms",
    withdrawalPollMs: "출금 폴링 ms",
    automaticLoops: "자동 루프",
    lastError: "마지막 오류",
  },
  gates: {
    publicServices: "공개 서비스",
    publicServicesOk: "Bridge service JSON이 공개 테스트넷에서 응답하고 있습니다.",
    publicServicesBad: "Bridge health가 아직 확인되지 않았습니다.",
    depositWatcher: "자동 입금 감시",
    depositWatcherDetail: (a, b) => `${a}/${b} routes가 실시간 입금 감시 증거를 보여줍니다.`,
    mapping: "route 매핑 무결성",
    mappingOk: "설정된 wrapped-token mapping이 gateway와 일치합니다.",
    mappingBad: "하나 이상의 route mapping 확인이 필요합니다.",
    depositRoutes: "입금 테스트 완료 route",
    depositRoutesDetail: (a, b) => `${a}/${b} routes가 공개 deposit evidence를 보여줍니다.`,
    releaseRoutes: "해제 증거가 있는 route",
    releaseRoutesDetail: (a, b) => `${a}/${b} routes가 release evidence를 보여줍니다. 일부 release는 아직 manual입니다.`,
    automaticRelease: "자동 해제 준비 상태",
    automaticReleaseOk: "최소 한 route가 더 강한 자동 해제 준비 상태를 보고합니다.",
    automaticReleaseBad: "자동 해제는 signer, lockbox 또는 release-enable 설정 부족으로 아직 막혀 있습니다.",
  },
};

const readinessEs: typeof readinessCopy.en = {
  ...readinessCopy.en,
  loading: "Cargando evidencia de readiness...",
  refreshed: "Evidencia en vivo actualizada",
  unavailable: "Evidencia de readiness no disponible",
  eyebrow: "Disciplina de candidato a mainnet",
  title: "Readiness se muestra como gates, no como adjetivo de marketing.",
  intro: "Esta página reúne evidencia pública en vivo sobre salud de rutas, automatización de watchers y comportamiento de release. Un estado verde significa que un gate de ensayo en testnet parece satisfecho; no convierte a YNX en un sistema production lanzado.",
  strongestEvidence: "Evidencia más fuerte",
  strongestEvidenceText: "Watcher scans en vivo, route mappings, minted deposits y released withdrawals sobre activos públicos de prueba.",
  notProven: "No probado aquí",
  notProvenText: "Estos JSON feeds no prueban auditoría externa, controles institucionales de firma ni sign-off legal/compliance.",
  nextThreshold: "Siguiente umbral",
  nextThresholdText: "Convertir el ensayo de rutas en madurez operativa revisable externamente, con operadores independientes y controles más fuertes.",
  gateScore: "Puntuación de gates",
  gateScoreText: "La puntuación resume la completitud del ensayo. Debe leerse junto con gates fallidos y blockers restantes, no como una afirmación binaria de production-ready.",
  refresh: "Actualizar evidencia",
  rawJson: "Abrir Raw JSON",
  remainingGaps: "Brechas restantes: auditoría externa, controles de firma production, operaciones independientes duraderas y estructura legal formal.",
  bridgeHealth: "Salud del Bridge",
  operationalCounters: "Contadores operativos",
  routeReadiness: "Preparación de rutas",
  perRouteEvidence: "Evidencia por ruta",
  depositTested: "depósito probado",
  minted: "emitidos",
  released: "liberados",
  deposit: "depósito",
  release: "liberación",
  automaticLoop: "bucle automático",
  ready: "listo",
  pending: "pendiente",
  watchers: "Vigilantes",
  scanTraces: "Trazas de scan de depósitos y retiros",
  block: "bloque",
  queued: "en cola",
  routeMapping: "Mapeo de rutas",
  gatewayChecks: "Checks de integridad del gateway",
  ok: "ok",
  fail: "fallo",
  disciplineNotice: "Esta página defiende disciplina de candidato a mainnet, no estado production terminado. Mainnet real todavía requiere auditorías externas, operadores independientes, controles production de firma/custodia y trabajo legal/compliance formal.",
  links: {
    assetsTitle: "Activos de prueba",
    assetsText: "Financia gas y añade activos públicos de prueba.",
    bridgeTitle: "Puente",
    bridgeText: "Inspecciona rutas de depósito y la superficie actual del bridge.",
    withdrawTitle: "Retiro",
    withdrawText: "Revisa el flujo de burn y source-release.",
    rawTitle: "Evidencia raw",
    rawText: "Abre el JSON de bridge health en vivo.",
  },
  counters: {
    routes: "rutas",
    depositWatchersLive: "deposit watchers en vivo",
    depositTestedRoutes: "rutas deposit-tested",
    routesWithReleaseEvidence: "rutas con release evidence",
    mintedDeposits: "minted deposits",
    releasedWithdrawals: "released withdrawals",
    watcherPollMs: "watcher poll ms",
    withdrawalPollMs: "withdrawal poll ms",
    automaticLoops: "bucles automáticos",
    lastError: "último error",
  },
  gates: {
    publicServices: "Servicios públicos",
    publicServicesOk: "Bridge service JSON responde en la testnet pública.",
    publicServicesBad: "Bridge health no está confirmado actualmente.",
    depositWatcher: "Deposit watcher automatizado",
    depositWatcherDetail: (a, b) => `${a}/${b} rutas muestran evidencia live deposit-watcher.`,
    mapping: "Integridad de route mapping",
    mappingOk: "Los wrapped-token mappings configurados coinciden con el gateway.",
    mappingBad: "Una o más rutas necesitan atención.",
    depositRoutes: "Rutas deposit-tested",
    depositRoutesDetail: (a, b) => `${a}/${b} rutas muestran evidencia pública de depósito hoy.`,
    releaseRoutes: "Rutas con release evidence",
    releaseRoutesDetail: (a, b) => `${a}/${b} rutas muestran release evidence observada, incluso si parte del release sigue manual.`,
    automaticRelease: "Preparación de liberación automática",
    automaticReleaseOk: "Al menos una ruta reporta una preparación de liberación automática más fuerte.",
    automaticReleaseBad: "La liberación automática sigue bloqueada por signer, lockbox o configuración release-enable faltante.",
  },
};

function copyFor(locale: Locale) {
  if (locale === "zh") return readinessCopy.zh;
  if (locale === "ja") return readinessJa;
  if (locale === "ko") return readinessKo;
  if (locale === "es") return readinessEs;
  return readinessCopy.en;
}

const localizedStatusValues = {
  loading: [readinessCopy.en.loading, readinessCopy.zh.loading, readinessJa.loading, readinessKo.loading, readinessEs.loading],
  refreshed: [readinessCopy.en.refreshed, readinessCopy.zh.refreshed, readinessJa.refreshed, readinessKo.refreshed, readinessEs.refreshed],
  unavailable: [readinessCopy.en.unavailable, readinessCopy.zh.unavailable, readinessJa.unavailable, readinessKo.unavailable, readinessEs.unavailable],
};

function localizeRoutePhrase(value: string, locale: Locale) {
  if (locale === "en") return value;
  const maps: Record<Exclude<Locale, "en">, Record<string, string>> = {
    zh: {
      "Automatic route ready": "自动路线就绪",
      "Full loop tested": "完整闭环已测试",
      "Full loop ready": "完整闭环就绪",
      "Deposit tested": "充值已测试",
      "Manual proof observed": "已观察到人工证明",
      "Release observed": "已观察到释放",
      "Watcher live": "监听器在线",
      "Mapped route": "路线已映射",
      "deposit tested": "充值已测试",
      "manual proof, watcher live": "人工证明，监听器在线",
      "manual proof observed": "已观察到人工证明",
      "watcher live": "监听器在线",
      "automatic release ready": "自动释放就绪",
      "release observed, adapter disabled": "已观察到释放，adapter 禁用",
      "release observed, signer pending": "已观察到释放，签名者待处理",
      "release observed, lockbox pending": "已观察到释放，lockbox 待处理",
      "release observed": "已观察到释放",
      "release pending signer": "release 签名者待处理",
      "release pending lockbox": "release lockbox 待处理",
      "release signer pending": "release 签名者待处理",
      "source lockbox unconfigured": "源链 lockbox 未配置",
      "release adapter disabled": "release adapter 已禁用",
      "deposit watcher unconfigured": "deposit watcher 未配置",
      pending: "待处理",
      unknown: "未知",
    },
    ja: {
      "Automatic route ready": "自動ルート準備完了",
      "Full loop tested": "完全ループテスト済み",
      "Full loop ready": "完全ループ準備完了",
      "Deposit tested": "入金テスト済み",
      "Manual proof observed": "手動証拠を確認済み",
      "Release observed": "解放を確認済み",
      "Watcher live": "監視サービス稼働中",
      "Mapped route": "ルートマッピング済み",
      "deposit tested": "入金テスト済み",
      "manual proof, watcher live": "手動証拠、監視サービス稼働中",
      "manual proof observed": "手動証拠を確認済み",
      "watcher live": "監視サービス稼働中",
      "automatic release ready": "自動解放準備完了",
      "release observed, adapter disabled": "解放を確認済み、adapter は無効",
      "release observed, signer pending": "解放を確認済み、署名者待ち",
      "release observed, lockbox pending": "解放を確認済み、lockbox 待ち",
      "release observed": "解放を確認済み",
      "release pending signer": "解放署名者待ち",
      "release pending lockbox": "解放 lockbox 待ち",
      "release signer pending": "解放署名者待ち",
      "source lockbox unconfigured": "source lockbox 未設定",
      "release adapter disabled": "release adapter は無効",
      "deposit watcher unconfigured": "入金監視未設定",
      pending: "保留",
      unknown: "不明",
    },
    ko: {
      "Automatic route ready": "자동 route 준비 완료",
      "Full loop tested": "전체 루프 테스트 완료",
      "Full loop ready": "전체 루프 준비 완료",
      "Deposit tested": "입금 테스트 완료",
      "Manual proof observed": "수동 증거 확인됨",
      "Release observed": "해제 확인됨",
      "Watcher live": "감시 서비스 동작 중",
      "Mapped route": "route 매핑 완료",
      "deposit tested": "입금 테스트 완료",
      "manual proof, watcher live": "수동 증거, 감시 서비스 동작 중",
      "manual proof observed": "수동 증거 확인됨",
      "watcher live": "감시 서비스 동작 중",
      "automatic release ready": "자동 해제 준비 완료",
      "release observed, adapter disabled": "해제 확인됨, adapter 비활성",
      "release observed, signer pending": "해제 확인됨, 서명자 대기",
      "release observed, lockbox pending": "해제 확인됨, lockbox 대기",
      "release observed": "해제 확인됨",
      "release pending signer": "해제 서명자 대기",
      "release pending lockbox": "해제 lockbox 대기",
      "release signer pending": "해제 서명자 대기",
      "source lockbox unconfigured": "source lockbox 미설정",
      "release adapter disabled": "release adapter 비활성",
      "deposit watcher unconfigured": "입금 감시 미설정",
      pending: "대기 중",
      unknown: "알 수 없음",
    },
    es: {
      "Automatic route ready": "ruta automática lista",
      "Full loop tested": "loop completo probado",
      "Full loop ready": "loop completo listo",
      "Deposit tested": "depósito probado",
      "Manual proof observed": "prueba manual observada",
      "Release observed": "release observado",
      "Watcher live": "watcher activo",
      "Mapped route": "ruta mapeada",
      "deposit tested": "depósito probado",
      "release observed, signer pending": "release observado, signer pendiente",
      "release observed, lockbox pending": "release observado, lockbox pendiente",
      "release pending signer": "signer de liberación pendiente",
      "release pending lockbox": "lockbox de liberación pendiente",
      "release signer pending": "signer de liberación pendiente",
      "source lockbox unconfigured": "source lockbox no configurado",
      pending: "pendiente",
      unknown: "desconocido",
    },
  };
  return maps[locale]?.[value] || value;
}

async function getJson<T>(url: string): Promise<T> {
  return fetchJsonWithTimeout<T>(url, { timeoutMs: 12000 });
}

export function Readiness() {
  const { locale } = useTranslation();
  const copy = copyFor(locale);
  const [health, setHealth] = useState<BridgeHealth | null>(null);
  const [watchers, setWatchers] = useState<WatcherResponse | null>(null);
  const [withdrawalWatchers, setWithdrawalWatchers] = useState<WatcherResponse | null>(null);
  const [routeChecks, setRouteChecks] = useState<RouteCheckResponse | null>(null);
  const [routeReadiness, setRouteReadiness] = useState<RouteReadinessResponse | null>(null);
  const [status, setStatus] = useState<string>(copy.loading);

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
      setStatus(copy.refreshed);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : copy.unavailable);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  useEffect(() => {
    setStatus((current) => {
      if (localizedStatusValues.loading.includes(current)) return copy.loading;
      if (localizedStatusValues.refreshed.includes(current)) return copy.refreshed;
      if (localizedStatusValues.unavailable.includes(current)) return copy.unavailable;
      return current;
    });
  }, [copy]);

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
        label: copy.gates.publicServices,
        ok: Boolean(health?.ok),
        detail: health?.ok ? copy.gates.publicServicesOk : copy.gates.publicServicesBad,
      },
      {
        label: copy.gates.depositWatcher,
        ok: watcherOk,
        detail: copy.gates.depositWatcherDetail(depositWatchersLive, routeTotal),
      },
      {
        label: copy.gates.mapping,
        ok: routeOk,
        detail: routeOk ? copy.gates.mappingOk : copy.gates.mappingBad,
      },
      {
        label: copy.gates.depositRoutes,
        ok: depositTestedOk,
        detail: copy.gates.depositRoutesDetail(depositTested, routeTotal),
      },
      {
        label: copy.gates.releaseRoutes,
        ok: releaseObservedOk,
        detail: copy.gates.releaseRoutesDetail(releaseObserved, routeTotal),
      },
      {
        label: copy.gates.automaticRelease,
        ok: automaticLoopOk || releaseOk,
        detail:
          automaticLoopOk || releaseOk
            ? copy.gates.automaticReleaseOk
            : copy.gates.automaticReleaseBad,
      },
    ];
  }, [copy, depositTested, depositWatchersLive, health, releaseObserved, routeItems, routeReadiness, routeTotal, watcherItems.length, withdrawalWatcherItems]);

  const passCount = gates.filter((gate) => gate.ok).length;

  return (
    <div className="min-h-screen pt-24 pb-28">
      <main className="mx-auto max-w-7xl px-6">
        <section className="grid gap-8 py-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="overflow-hidden rounded-[2rem] border border-border bg-white shadow-sm">
            <div className="ynx-mesh border-b border-border px-8 py-10">
              <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-ink/45">{copy.eyebrow}</p>
              <h1 className="mt-4 max-w-3xl font-display text-5xl font-semibold tracking-tight text-ink md:text-6xl">
                {copy.title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-ink/68 md:text-lg">
                {copy.intro}
              </p>
            </div>

            <div className="grid gap-4 px-8 py-8 md:grid-cols-3">
              <div className="rounded-2xl border border-border bg-surface/70 p-5">
                <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink/45">{copy.strongestEvidence}</p>
                <p className="mt-3 text-sm leading-6 text-ink/72">
                  {copy.strongestEvidenceText}
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-surface/70 p-5">
                <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink/45">{copy.notProven}</p>
                <p className="mt-3 text-sm leading-6 text-ink/72">
                  {copy.notProvenText}
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-surface/70 p-5">
                <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink/45">{copy.nextThreshold}</p>
                <p className="mt-3 text-sm leading-6 text-ink/72">
                  {copy.nextThresholdText}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-ink p-8 text-white shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-white/45">{copy.gateScore}</p>
                <h2 className="mt-3 font-display text-5xl font-semibold tracking-tight">{passCount}/{gates.length}</h2>
              </div>
              <ShieldCheck className="h-6 w-6 text-emerald-300" />
            </div>
            <p className="mt-6 text-sm leading-6 text-white/72">
              {copy.gateScoreText}
            </p>
            <div className="mt-8 grid gap-3">
              <Button onClick={refresh} variant="klein" className="justify-between rounded-xl">
                {copy.refresh}
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button asChild variant="outline" className="justify-between rounded-xl border-white/15 bg-white/5 text-white hover:bg-white/10">
                <a href="https://rpc.ynxweb4.com/bridge/health" target="_blank" rel="noreferrer">
                  {copy.rawJson}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-6 text-white/65">
              {copy.remainingGaps}
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
            <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink/45">{copy.bridgeHealth}</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink">{copy.operationalCounters}</h2>
            <div className="mt-8 space-y-3">
              {[
                [copy.counters.routes, health?.stats?.routes ?? "-"],
                [copy.counters.depositWatchersLive, `${depositWatchersLive}/${routeTotal}`],
                [copy.counters.depositTestedRoutes, `${depositTested}/${routeTotal}`],
                [copy.counters.routesWithReleaseEvidence, `${releaseObserved}/${routeTotal}`],
                [copy.counters.mintedDeposits, health?.stats?.minted_deposits ?? "-"],
                [copy.counters.releasedWithdrawals, health?.stats?.released_withdrawals ?? "-"],
                [copy.counters.watcherPollMs, health?.onchain?.watcher_poll_ms ?? "-"],
                [copy.counters.withdrawalPollMs, health?.onchain?.withdrawal_watcher_poll_ms ?? "-"],
                [copy.counters.automaticLoops, routeReadiness?.summary?.automatic_loop_ready ?? "-"],
                [copy.counters.lastError, health?.onchain?.last_error || "-"],
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
                <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink/45">{copy.routeReadiness}</p>
                <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink">{copy.perRouteEvidence}</h2>
              </div>
              <p className="font-mono text-sm text-ink/55">
                {copy.depositTested} {depositTested}/{routeTotal}
              </p>
            </div>
            <div className="mt-8 grid gap-3 md:grid-cols-2">
              {routeReadinessItems.map((item) => (
                <div key={item.routeId} className="rounded-2xl border border-border bg-surface/60 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-ink">{routeDisplayName(item)}</p>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase ${item.automatic_loop_ready ? "bg-emerald-50 text-emerald-700" : hasReleaseEvidence(item) ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"}`}>
                      {localizeRoutePhrase(summarizeRoutePhase(item), locale)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-ink/60">{item.routeId}</p>
                  <p className="mt-3 font-mono text-xs text-ink/60">
                    {copy.minted} {item.evidence?.minted_deposits ?? 0} / {copy.released} {item.evidence?.released_withdrawals ?? 0}
                  </p>
                  <p className="mt-2 font-mono text-xs text-ink/60">
                    {copy.deposit} {localizeRoutePhrase(summarizeDepositStatus(item), locale)} / {copy.release} {localizeRoutePhrase(summarizeReleaseStatus(item), locale)}
                  </p>
                  <p className={`mt-2 text-xs font-semibold ${item.automatic_loop_ready ? "text-emerald-700" : "text-amber-700"}`}>
                    {copy.automaticLoop} {item.automatic_loop_ready ? copy.ready : copy.pending}
                  </p>
                  {!!item.blockers?.length && (
                    <p className="mt-2 break-words font-mono text-xs text-amber-700">
                      {summarizeBlockers(item).map((blocker) => localizeRoutePhrase(blocker, locale)).join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-border bg-white p-8 shadow-sm">
            <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink/45">{copy.watchers}</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink">{copy.scanTraces}</h2>
            <div className="mt-8 grid gap-3 md:grid-cols-2">
              {watcherItems.map(([routeId, watcher]) => (
                <div key={routeId} className="rounded-2xl border border-border bg-surface/60 p-4">
                  <p className="font-semibold text-ink">{routeId}</p>
                  <p className="mt-3 font-mono text-xs text-ink/60">{copy.block} {watcher.last_scanned_block || "-"}</p>
                  <p className="font-mono text-xs text-ink/60">{copy.minted} {watcher.deposits_minted ?? "-"}</p>
                  <p className="truncate font-mono text-xs text-ink/60">{watcher.last_scan_at || "-"}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {withdrawalWatcherItems.map(([routeId, watcher]) => (
                <div key={routeId} className="rounded-2xl border border-border bg-surface/60 p-4">
                  <p className="font-semibold text-ink">{routeId}</p>
                  <p className="mt-3 font-mono text-xs text-ink/60">{copy.block} {watcher.last_scanned_block || "-"}</p>
                  <p className="font-mono text-xs text-ink/60">{copy.queued} {watcher.withdrawals_queued ?? "-"}</p>
                  <p className="font-mono text-xs text-ink/60">{copy.released} {watcher.releases_executed ?? "-"}</p>
                  <p className="truncate font-mono text-xs text-ink/60">{watcher.last_scan_at || "-"}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-white p-8 shadow-sm">
            <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-ink/45">{copy.routeMapping}</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink">{copy.gatewayChecks}</h2>
            <div className="mt-8 grid gap-3 md:grid-cols-2">
              {routeItems.map((item) => (
                <div key={item.routeId} className="rounded-2xl border border-border bg-surface/60 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-ink">{item.routeId}</p>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase ${item.ok ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                      {item.ok ? copy.ok : copy.fail}
                    </span>
                  </div>
                  <p className="mt-3 truncate font-mono text-xs text-ink/60">{item.mappedWrappedToken || item.error || "-"}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
              <Activity className="mb-2 h-4 w-4" />
              {copy.disciplineNotice}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-4">
          <Link to="/test-assets" className="rounded-[1.5rem] border border-border bg-white p-5 shadow-sm transition hover:border-klein/40">
            <p className="font-display text-lg font-semibold">{copy.links.assetsTitle}</p>
            <p className="mt-2 text-sm text-ink/60">{copy.links.assetsText}</p>
          </Link>
          <Link to="/bridge" className="rounded-[1.5rem] border border-border bg-white p-5 shadow-sm transition hover:border-klein/40">
            <p className="font-display text-lg font-semibold">{copy.links.bridgeTitle}</p>
            <p className="mt-2 text-sm text-ink/60">{copy.links.bridgeText}</p>
          </Link>
          <Link to="/withdraw" className="rounded-[1.5rem] border border-border bg-white p-5 shadow-sm transition hover:border-klein/40">
            <p className="font-display text-lg font-semibold">{copy.links.withdrawTitle}</p>
            <p className="mt-2 text-sm text-ink/60">{copy.links.withdrawText}</p>
          </Link>
          <a href="https://rpc.ynxweb4.com/bridge/health" target="_blank" rel="noreferrer" className="rounded-[1.5rem] border border-border bg-white p-5 shadow-sm transition hover:border-klein/40">
            <p className="flex items-center gap-2 font-display text-lg font-semibold">
              {copy.links.rawTitle} <ExternalLink className="h-4 w-4" />
            </p>
            <p className="mt-2 text-sm text-ink/60">{copy.links.rawText}</p>
          </a>
        </section>
      </main>
    </div>
  );
}
