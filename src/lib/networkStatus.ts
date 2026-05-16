import { NETWORK } from "../constants/network";

export type ServiceState = "online" | "degraded" | "offline";

export interface ServiceStatus {
  status: ServiceState;
  latency_ms?: number;
  data?: unknown;
  error?: string;
  code?: number;
}

export type NetworkStatusResponse = Record<string, ServiceStatus | string | number | boolean | undefined>;

type EndpointConfig = {
  url: string;
  method?: "GET" | "POST" | "HEAD";
  body?: unknown;
  acceptStatuses?: number[];
  parseJson?: boolean;
  timeoutMs?: number;
  check: (data: unknown, response: Response) => ServiceState;
  summarize?: (data: unknown) => unknown;
};

const EXPECTED_CHAIN_ID = NETWORK.chainId;
const EXPECTED_EVM_CHAIN_ID_HEX = NETWORK.evmChainIdHex;

const ENDPOINTS: Record<string, EndpointConfig> = {
  rpc: {
    url: `${NETWORK.endpoints.rpc}/status`,
    timeoutMs: 5500,
    check: (data) => {
      const result = (data as any)?.result;
      if (result?.node_info?.network === EXPECTED_CHAIN_ID) {
        return result?.sync_info?.catching_up ? "degraded" : "online";
      }
      return "offline";
    },
    summarize: (data) => {
      const result = (data as any)?.result;
      return {
        network: result?.node_info?.network,
        moniker: result?.node_info?.moniker,
        latest_block_height: result?.sync_info?.latest_block_height,
        latest_block_time: result?.sync_info?.latest_block_time,
        catching_up: result?.sync_info?.catching_up,
      };
    },
  },
  evm: {
    url: NETWORK.endpoints.evm,
    method: "POST",
    timeoutMs: 5500,
    body: { jsonrpc: "2.0", id: 1, method: "eth_chainId", params: [] },
    check: (data) => ((data as any)?.result === EXPECTED_EVM_CHAIN_ID_HEX ? "online" : "offline"),
    summarize: (data) => ({ chain_id: (data as any)?.result }),
  },
  rest: {
    url: `${NETWORK.endpoints.rest}/cosmos/base/tendermint/v1beta1/node_info`,
    timeoutMs: 5500,
    check: (data) =>
      (data as any)?.default_node_info?.network === EXPECTED_CHAIN_ID ? "online" : "offline",
    summarize: (data) => {
      const node = (data as any)?.default_node_info;
      return {
        network: node?.network,
        moniker: node?.moniker,
        version: node?.version,
      };
    },
  },
  grpc: {
    url: NETWORK.endpoints.grpc,
    acceptStatuses: [200, 404, 415],
    parseJson: false,
    timeoutMs: 3500,
    check: (_data, response) =>
      response.ok || response.status === 404 || response.status === 415 ? "online" : "offline",
  },
  faucet: {
    url: `${NETWORK.endpoints.faucet}/health`,
    timeoutMs: 5000,
    check: (data) =>
      (data as any)?.ok === true && (data as any)?.chain_id === EXPECTED_CHAIN_ID ? "online" : "offline",
    summarize: (data) => {
      const body = data as any;
      return {
        ok: body?.ok,
        chain_id: body?.chain_id,
        denom: body?.denom,
        amount: body?.amount,
      };
    },
  },
  indexer: {
    url: `${NETWORK.endpoints.indexer}/health`,
    timeoutMs: 5000,
    check: (data) => {
      const body = data as any;
      if (body?.ok === true && body?.chain_id === EXPECTED_CHAIN_ID) {
        const lag = (body.latest_seen || 0) - (body.last_indexed || 0);
        return lag > 10 ? "degraded" : "online";
      }
      return "offline";
    },
    summarize: (data) => {
      const body = data as any;
      return {
        ok: body?.ok,
        chain_id: body?.chain_id,
        last_indexed: body?.last_indexed,
        latest_seen: body?.latest_seen,
      };
    },
  },
  explorer: {
    url: NETWORK.endpoints.explorer,
    method: "HEAD",
    parseJson: false,
    timeoutMs: 5500,
    check: (_data, response) => (response.ok ? "online" : "offline"),
  },
  ai: {
    url: `${NETWORK.endpoints.ai}/health`,
    timeoutMs: 5500,
    check: (data) =>
      (data as any)?.ok === true && (data as any)?.service === "ynx-ai-gateway" ? "online" : "offline",
    summarize: (data) => {
      const body = data as any;
      return {
        ok: body?.ok,
        chain_id: body?.chain_id,
        service: body?.service,
        enforce_policy: body?.enforce_policy,
        has_web4_authorizer: body?.has_web4_authorizer,
        stats: body?.stats,
      };
    },
  },
  web4: {
    url: `${NETWORK.endpoints.web4}/health`,
    timeoutMs: 5500,
    check: (data) =>
      (data as any)?.ok === true && (data as any)?.service === "ynx-web4-hub" ? "online" : "offline",
    summarize: (data) => {
      const body = data as any;
      return {
        ok: body?.ok,
        chain_id: body?.chain_id,
        service: body?.service,
        track: body?.track,
        enforce_policy: body?.enforce_policy,
        internal_authorizer_enabled: body?.internal_authorizer_enabled,
        stats: body?.stats,
      };
    },
  },
};

async function fetchWithTimeout(config: EndpointConfig, timeoutMs: number) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(config.url, {
      method: config.method || "GET",
      signal: controller.signal,
      headers: {
        Accept: config.parseJson === false ? "*/*" : "application/json",
        ...(config.body ? { "Content-Type": "application/json" } : {}),
      },
      body: config.body ? JSON.stringify(config.body) : undefined,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

async function checkService(config: EndpointConfig): Promise<ServiceStatus> {
  const start = Date.now();

  try {
    const response = await fetchWithTimeout(config, config.timeoutMs ?? 3000);
    const latency_ms = Date.now() - start;
    const acceptable = response.ok || config.acceptStatuses?.includes(response.status);

    if (!acceptable) {
      return {
        status: "offline",
        code: response.status,
        latency_ms,
        error: `HTTP ${response.status}`,
      };
    }

    let data: unknown = null;
    if (config.parseJson !== false) {
      const text = await response.text();
      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          return {
            status: "offline",
            code: response.status,
            latency_ms,
            error: "invalid_json",
          };
        }
      }
    }

    const status = config.check(data, response);
    return {
      status,
      latency_ms,
      data:
        status === "online" || status === "degraded"
          ? config.summarize
            ? config.summarize(data)
            : data
          : undefined,
    };
  } catch (error) {
    const err = error as Error;
    return {
      status: "offline",
      latency_ms: Date.now() - start,
      error: err.name === "AbortError" ? "timeout" : "unreachable",
    };
  }
}

export async function getNetworkStatus(): Promise<NetworkStatusResponse> {
  const results: NetworkStatusResponse = {
    updated_at: new Date().toISOString(),
    chain_id: EXPECTED_CHAIN_ID,
    evm_chain_id: EXPECTED_EVM_CHAIN_ID_HEX,
    source: "live-probe",
  };

  const checks = Object.entries(ENDPOINTS).map(async ([key, config]) => {
    results[key] = await checkService(config);
  });

  await Promise.allSettled(checks);

  const serviceStatuses = Object.keys(ENDPOINTS)
    .map((key) => results[key])
    .filter((item): item is ServiceStatus => typeof item === "object" && item !== null && "status" in item);
  const online = serviceStatuses.filter((item) => item.status === "online").length;
  const degraded = serviceStatuses.filter((item) => item.status === "degraded").length;
  const offline = serviceStatuses.filter((item) => item.status === "offline").length;

  results.summary =
    offline === 0 && degraded === 0
      ? "online"
      : online > 0
        ? "degraded"
        : "offline";
  results.online_count = online;
  results.degraded_count = degraded;
  results.offline_count = offline;

  return results;
}
