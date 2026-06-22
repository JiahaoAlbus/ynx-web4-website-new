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

type PublicOperationsEndpointResponse = {
  ok: boolean;
  updated_at?: string;
  chain_id?: string;
  validator?: {
    bonded_count?: number;
    unjailed_count?: number;
    signed_count?: number;
    indexer_total?: number;
    public_peers?: number;
    min_validators?: number;
    min_public_peers?: number;
    validator_gate_pass?: boolean;
    peer_gate_pass?: boolean;
    overall_gate_pass?: boolean;
    validators?: Array<{
      moniker?: string;
      operator?: string;
      status?: string;
      jailed?: boolean;
    }>;
  };
  routes?: PublicOpsSnapshot["routes"];
  errors?: string[];
};

function fromDedicatedEndpoint(payload: PublicOperationsEndpointResponse): PublicOpsSnapshot {
  const validator = payload.validator
    ? {
        updated_at: payload.updated_at || new Date().toISOString(),
        chain_id: payload.chain_id || NETWORK.chainId,
        bonded_count: Number(payload.validator.bonded_count || 0),
        unjailed_count: Number(payload.validator.unjailed_count || 0),
        signed_count: Number(payload.validator.signed_count || 0),
        indexer_total: Number(payload.validator.indexer_total || 0),
        public_peers: Number(payload.validator.public_peers || 0),
        min_validators: Number(payload.validator.min_validators || 4),
        min_public_peers: Number(payload.validator.min_public_peers || 2),
        validator_gate_pass: payload.validator.validator_gate_pass === true,
        peer_gate_pass: payload.validator.peer_gate_pass === true,
        overall_gate_pass: payload.validator.overall_gate_pass === true,
        validators: Array.isArray(payload.validator.validators)
          ? payload.validator.validators.map((item) => ({
              moniker: String(item.moniker || "unknown"),
              operator: String(item.operator || ""),
              status: String(item.status || ""),
              jailed: Boolean(item.jailed),
            }))
          : [],
        errors: payload.errors || [],
      }
    : null;

  return {
    updated_at: payload.updated_at || new Date().toISOString(),
    validator,
    routes: {
      total: payload.routes?.total ?? null,
      deposit_watchers_live: payload.routes?.deposit_watchers_live ?? null,
      deposit_tested: payload.routes?.deposit_tested ?? null,
      release_observed: payload.routes?.release_observed ?? null,
      automatic_loop_ready: payload.routes?.automatic_loop_ready ?? null,
      blockers: payload.routes?.blockers || [],
    },
    errors: payload.errors || [],
  };
}

export async function getPublicOpsSnapshot(): Promise<PublicOpsSnapshot> {
  try {
    const dedicated = await fetchJsonWithTimeout<PublicOperationsEndpointResponse>(
      `${NETWORK.endpoints.indexer}/ynx/public-operations`,
      { timeoutMs: 12000, cache: "no-store" },
    );
    if (dedicated?.ok) {
      return fromDedicatedEndpoint(dedicated);
    }
  } catch {
    // Fall through to the legacy multi-request path.
  }

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
