import { NETWORK } from "../constants/network";
import { fetchJsonWithTimeout } from "./request";
import {
  countDepositTested,
  countDepositWatchersLive,
  countReleaseObserved,
  routeDisplayName,
  summarizeBlockers,
  summarizeDepositStatus,
  summarizeReleaseStatus,
  type RouteReadinessLike,
} from "./routeReadiness";
import type { ValidatorReadinessResult } from "./validatorReadiness";

type RouteReadinessItem = RouteReadinessLike;

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
    total: number | null;
    deposit_watchers_live: number | null;
    deposit_tested: number | null;
    release_observed: number | null;
    automatic_loop_ready: number | null;
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

export async function getPublicOpsSnapshot(): Promise<PublicOpsSnapshot> {
  const errors: string[] = [];

  const [validator, routeReadiness] = await Promise.allSettled([
    import("./validatorReadiness").then((mod) => mod.getValidatorReadiness()),
    fetchJsonWithTimeout<RouteReadinessResponse>(
      `${NETWORK.endpoints.rpc}/bridge/route-readiness`,
      { timeoutMs: 12000, cache: "no-store" },
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
  const hasRouteData = Boolean(routeData && (items.length > 0 || routeData.summary?.routes));
  const blockers = items
    .filter((item) => !item.automatic_loop_ready)
    .map((item) => ({
      routeId: item.routeId,
      displayName: routeDisplayName(item),
      blockers: summarizeBlockers(item),
      depositStatus: summarizeDepositStatus(item),
      releaseStatus: summarizeReleaseStatus(item),
    }));

  return {
    updated_at: new Date().toISOString(),
    validator: validatorData,
    routes: {
      total: hasRouteData ? routeData?.summary?.routes || items.length : null,
      deposit_watchers_live: hasRouteData ? countDepositWatchersLive(items) : null,
      deposit_tested: hasRouteData ? countDepositTested(items) : null,
      release_observed: hasRouteData ? countReleaseObserved(items) : null,
      automatic_loop_ready: hasRouteData ? routeData?.summary?.automatic_loop_ready || 0 : null,
      blockers,
    },
    errors,
  };
}
