import { NETWORK } from "../constants/network";

type BondedValidator = {
  moniker: string;
  operator: string;
  status: string;
  jailed: boolean;
};

export type ValidatorReadinessResult = {
  updated_at: string;
  chain_id: string;
  bonded_count: number;
  unjailed_count: number;
  signed_count: number;
  indexer_total: number;
  public_peers: number;
  min_validators: number;
  min_public_peers: number;
  validator_gate_pass: boolean;
  peer_gate_pass: boolean;
  overall_gate_pass: boolean;
  validators: BondedValidator[];
  errors: string[];
};

const MIN_VALIDATORS = 4;
const MIN_PUBLIC_PEERS = 2;
const CHAIN_ID = NETWORK.chainId;

async function fetchJson(url: string, timeoutMs = 8000): Promise<any> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

function parsePeers(payload: any): number {
  const raw = payload?.result?.n_peers ?? payload?.n_peers ?? 0;
  const num = Number(raw);
  return Number.isFinite(num) ? num : 0;
}

function parseBondedValidators(payload: any): BondedValidator[] {
  const list = Array.isArray(payload?.validators) ? payload.validators : [];
  return list.map((item: any) => ({
    moniker: String(item?.description?.moniker || "unknown"),
    operator: String(item?.operator_address || ""),
    status: String(item?.status || ""),
    jailed: Boolean(item?.jailed),
  }));
}

export async function getValidatorReadiness(): Promise<ValidatorReadinessResult> {
  const errors: string[] = [];

  const [restBonded, indexerValidators, rpcNetInfo] = await Promise.allSettled([
    fetchJson(`${NETWORK.endpoints.rest}/cosmos/staking/v1beta1/validators?status=BOND_STATUS_BONDED&pagination.limit=100`),
    fetchJson(`${NETWORK.endpoints.indexer}/validators`),
    fetchJson(`${NETWORK.endpoints.rpc}/net_info`),
  ]);

  let validators: BondedValidator[] = [];
  if (restBonded.status === "fulfilled") {
    validators = parseBondedValidators(restBonded.value);
  } else {
    errors.push(`rest_bonded_failed:${restBonded.reason instanceof Error ? restBonded.reason.message : "unknown"}`);
  }

  let signedCount = 0;
  let indexerTotal = 0;
  if (indexerValidators.status === "fulfilled") {
    const payload = indexerValidators.value;
    const stats = payload?.stats ?? payload;
    signedCount = Number(stats?.signed_count || 0);
    indexerTotal = Number(stats?.total || 0);
  } else {
    errors.push(`indexer_validators_failed:${indexerValidators.reason instanceof Error ? indexerValidators.reason.message : "unknown"}`);
  }

  let publicPeers = 0;
  if (rpcNetInfo.status === "fulfilled") {
    publicPeers = parsePeers(rpcNetInfo.value);
  } else {
    errors.push(`rpc_net_info_failed:${rpcNetInfo.reason instanceof Error ? rpcNetInfo.reason.message : "unknown"}`);
  }

  const bondedCount = validators.length;
  const unjailedCount = validators.filter((item) => !item.jailed).length;
  const validatorGatePass = bondedCount >= MIN_VALIDATORS && unjailedCount >= MIN_VALIDATORS;
  const peerGatePass = publicPeers >= MIN_PUBLIC_PEERS;

  return {
    updated_at: new Date().toISOString(),
    chain_id: CHAIN_ID,
    bonded_count: bondedCount,
    unjailed_count: unjailedCount,
    signed_count: Number.isFinite(signedCount) ? signedCount : 0,
    indexer_total: Number.isFinite(indexerTotal) ? indexerTotal : 0,
    public_peers: publicPeers,
    min_validators: MIN_VALIDATORS,
    min_public_peers: MIN_PUBLIC_PEERS,
    validator_gate_pass: validatorGatePass,
    peer_gate_pass: peerGatePass,
    overall_gate_pass: validatorGatePass && peerGatePass,
    validators,
    errors,
  };
}
