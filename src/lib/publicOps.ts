import { NETWORK } from "../constants/network";
import { fetchJsonWithTimeout } from "./request";
import type { ValidatorReadinessResult } from "./validatorReadiness";

type RouteReadinessEvidence = {
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
};

type RouteReadinessItem = {
  routeId: string;
  displayName?: string;
  asset?: string;
  sourceNetwork?: string;
  automatic_loop_ready?: boolean;
  blockers?: string[];
  evidence?: RouteReadinessEvidence;
};

type RouteReadinessResponse = {
  ok: boolean;
  updated_at?: string;
  items?: RouteReadinessItem[];
  summary?: {
    routes?: number;
    full_loop_ready?: number;
    full_loop_tested?: number;
    automatic_loop_ready?: number;
    deposit_tested?: number;
    mapped_route_only?: number;
  };
};

export type PublicOpsSnapshot = {
  updated_at: string;
  validator: ValidatorReadinessResult | null;
  routes: {
    total: number;
    full_loop_tested: number;
    automatic_loop_ready: number;
    blockers: Array<{
      routeId: string;
      displayName: string;
      blockers: string[];
      depositStatus: string;
      releaseStatus: string;
    }>;
  };
  errors: string[];
};

function normalizeRouteLabel(item: RouteReadinessItem) {
  return item.displayName || item.routeId || item.asset || "Unknown Route";
}

export async function getPublicOpsSnapshot(): Promise<PublicOpsSnapshot> {
  const errors: string[] = [];

  const [validator, routeReadiness] = await Promise.allSettled([
    import("./validatorReadiness").then((mod) => mod.getValidatorReadiness()),
    fetchJsonWithTimeout<RouteReadinessResponse>(
      `${NETWORK.endpoints.rpc}/bridge/route-readiness`,
      { timeoutMs: 4000, cache: "no-store" },
    ),
  ]);

  const validatorData =
    validator.status === "fulfilled"
      ? validator.value
      : (errors.push(
          `validator_readiness_failed:${
            validator.reason instanceof Error ? validator.reason.message : "unknown"
          }`,
        ),
        null);

  const routeData =
    routeReadiness.status === "fulfilled"
      ? routeReadiness.value
      : (errors.push(
          `route_readiness_failed:${
            routeReadiness.reason instanceof Error ? routeReadiness.reason.message : "unknown"
          }`,
        ),
        null);

  const items = routeData?.items || [];
  const blockers = items
    .filter((item) => !item.automatic_loop_ready)
    .map((item) => ({
      routeId: item.routeId,
      displayName: normalizeRouteLabel(item),
      blockers: item.blockers || [],
      depositStatus: item.evidence?.deposit_watcher_status?.status || "unknown",
      releaseStatus: item.evidence?.release_adapter_status?.status || "unknown",
    }));

  return {
    updated_at: new Date().toISOString(),
    validator: validatorData,
    routes: {
      total: routeData?.summary?.routes || items.length,
      full_loop_tested: routeData?.summary?.full_loop_tested || 0,
      automatic_loop_ready: routeData?.summary?.automatic_loop_ready || 0,
      blockers,
    },
    errors,
  };
}
