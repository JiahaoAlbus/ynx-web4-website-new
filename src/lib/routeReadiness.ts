export type RouteReadinessEvidence = {
  minted_deposits?: number;
  released_withdrawals?: number;
  deposit_watcher_status?: {
    status?: string;
    configured?: boolean;
    live?: boolean;
    adapter?: string;
  };
  release_adapter_status?: {
    status?: string;
    configured?: boolean;
    automatic?: boolean;
    adapter?: string;
  };
  withdrawal_watcher?: {
    last_scan_at?: string;
    releases_executed?: number;
    last_error?: string;
  };
};

export type RouteReadinessLike = {
  routeId: string;
  phase?: string;
  displayName?: string;
  asset?: string;
  wrappedSymbol?: string;
  automatic_loop_ready?: boolean;
  full_loop_ready?: boolean;
  full_loop_tested?: boolean;
  blockers?: string[];
  evidence?: RouteReadinessEvidence;
};

export function routeDisplayName(route: RouteReadinessLike) {
  return route.displayName || route.wrappedSymbol || route.asset || route.routeId;
}

export function humanizeToken(value?: string) {
  if (!value) return "unknown";
  return value.replaceAll("_", " ");
}

export function isDepositWatcherLive(route: RouteReadinessLike) {
  const status = route.evidence?.deposit_watcher_status?.status;
  return status === "live" || route.evidence?.deposit_watcher_status?.live === true;
}

export function hasDepositEvidence(route: RouteReadinessLike) {
  return (
    Number(route.evidence?.minted_deposits || 0) > 0 ||
    route.phase === "deposit_tested" ||
    route.full_loop_ready === true ||
    route.full_loop_tested === true
  );
}

export function hasReleaseEvidence(route: RouteReadinessLike) {
  return (
    Number(route.evidence?.released_withdrawals || 0) > 0 ||
    Number(route.evidence?.withdrawal_watcher?.releases_executed || 0) > 0 ||
    route.full_loop_tested === true
  );
}

export function summarizeRoutePhase(route: RouteReadinessLike) {
  if (route.automatic_loop_ready) return "Automatic route ready";
  if (hasReleaseEvidence(route)) return "Release observed";
  if (hasDepositEvidence(route)) return "Deposit tested";
  if (isDepositWatcherLive(route)) return "Watcher live";
  if (route.phase === "mapped_route_only") return "Mapped route";
  return humanizeToken(route.phase);
}

export function summarizeDepositStatus(route: RouteReadinessLike) {
  if (hasDepositEvidence(route)) return "deposit tested";
  if (isDepositWatcherLive(route)) return "watcher live";
  return humanizeToken(route.evidence?.deposit_watcher_status?.status || route.phase);
}

export function summarizeReleaseStatus(route: RouteReadinessLike) {
  if (route.automatic_loop_ready) return "automatic release ready";
  if (hasReleaseEvidence(route)) return "release observed";
  return humanizeToken(route.evidence?.release_adapter_status?.status || "pending");
}

export function summarizeBlockers(route: RouteReadinessLike) {
  return (route.blockers || []).map(humanizeToken);
}

export function countDepositWatchersLive(routes: RouteReadinessLike[]) {
  return routes.filter(isDepositWatcherLive).length;
}

export function countDepositTested(routes: RouteReadinessLike[]) {
  return routes.filter(hasDepositEvidence).length;
}

export function countReleaseObserved(routes: RouteReadinessLike[]) {
  return routes.filter(hasReleaseEvidence).length;
}
