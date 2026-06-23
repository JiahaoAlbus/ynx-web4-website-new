import { NETWORK } from "../constants/network";
import { fetchJsonWithTimeout } from "./request";
import type { ValidatorReadinessResult } from "./validatorReadiness";

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
  const dedicated = await fetchJsonWithTimeout<PublicOperationsEndpointResponse>(
    `${NETWORK.endpoints.indexer}/ynx/public-operations`,
    { timeoutMs: 12000, cache: "no-store" },
  );
  if (!dedicated?.ok) {
    throw new Error("public_operations_unavailable");
  }
  return fromDedicatedEndpoint(dedicated);
}
