type ServiceState = "online" | "degraded" | "offline";

type ServiceStatus = {
  status: ServiceState;
  latency_ms?: number;
  data?: unknown;
  error?: string;
  code?: number;
};

type NetworkStatusResponse = Record<
  string,
  ServiceStatus | string | number | boolean | undefined
>;

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

const NETWORK = {
  chainId: "ynx_9102-1",
  evmChainIdHex: "0x238e",
  endpoints: {
    rpc: "https://rpc.ynxweb4.com",
    evm: "https://evm.ynxweb4.com",
    rest: "https://rest.ynxweb4.com",
    grpc: "https://grpc.ynxweb4.com",
    faucet: "https://faucet.ynxweb4.com",
    indexer: "https://indexer.ynxweb4.com",
    explorer: "https://explorer.ynxweb4.com",
    ai: "https://ai.ynxweb4.com",
    web4: "https://web4.ynxweb4.com",
  },
};

const CACHE_TTL_MS = 15_000;
const REVALIDATE_AFTER_MS = 45_000;
const LAST_HEALTHY_TTL_MS = 10 * 60_000;
const RESTART_OFFLINE_THRESHOLD = 5;
const RESTART_ONLINE_FLOOR = 2;

type CachedNetworkStatus = {
  payload: NetworkStatusResponse;
  fetchedAt: number;
};

type LastHealthySnapshot = {
  payload: NetworkStatusResponse;
  fetchedAt: number;
};

const ENDPOINTS: Record<string, EndpointConfig> = {
  rpc: {
    url: `${NETWORK.endpoints.rpc}/status`,
    timeoutMs: 1800,
    check: (data) => {
      const result = (data as any)?.result;
      if (result?.node_info?.network === NETWORK.chainId) {
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
    timeoutMs: 1800,
    body: { jsonrpc: "2.0", id: 1, method: "eth_chainId", params: [] },
    check: (data) =>
      (data as any)?.result === NETWORK.evmChainIdHex ? "online" : "offline",
    summarize: (data) => ({ chain_id: (data as any)?.result }),
  },
  rest: {
    url: `${NETWORK.endpoints.rest}/cosmos/base/tendermint/v1beta1/node_info`,
    timeoutMs: 1800,
    check: (data) =>
      (data as any)?.default_node_info?.network === NETWORK.chainId
        ? "online"
        : "offline",
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
    timeoutMs: 1500,
    check: (_data, response) =>
      response.ok || response.status === 404 || response.status === 415
        ? "online"
        : "offline",
  },
  faucet: {
    url: `${NETWORK.endpoints.faucet}/health`,
    timeoutMs: 1800,
    check: (data) =>
      (data as any)?.ok === true && (data as any)?.chain_id === NETWORK.chainId
        ? "online"
        : "offline",
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
    timeoutMs: 1800,
    check: (data) => {
      const body = data as any;
      if (body?.ok === true && body?.chain_id === NETWORK.chainId) {
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
    timeoutMs: 1800,
    check: (_data, response) => (response.ok ? "online" : "offline"),
  },
  ai: {
    url: `${NETWORK.endpoints.ai}/health`,
    timeoutMs: 1800,
    check: (data) =>
      (data as any)?.ok === true &&
      (data as any)?.service === "ynx-ai-gateway"
        ? "online"
        : "offline",
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
    timeoutMs: 1800,
    check: (data) =>
      (data as any)?.ok === true && (data as any)?.service === "ynx-web4-hub"
        ? "online"
        : "offline",
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

let cachedStatus: CachedNetworkStatus | null = null;
let inFlightStatus: Promise<NetworkStatusResponse> | null = null;
let lastHealthyStatus: LastHealthySnapshot | null = null;

function getCount(payload: NetworkStatusResponse, key: string) {
  const value = payload[key];
  return typeof value === "number" ? value : 0;
}

function isHealthySnapshot(payload: NetworkStatusResponse) {
  return payload.summary === "healthy" || getCount(payload, "offline") === 0;
}

function shouldServeLastHealthySnapshot(payload: NetworkStatusResponse) {
  if (!lastHealthyStatus) {
    return false;
  }

  const ageMs = Date.now() - lastHealthyStatus.fetchedAt;
  if (ageMs > LAST_HEALTHY_TTL_MS) {
    return false;
  }

  const offlineCount = getCount(payload, "offline");
  const onlineCount = getCount(payload, "online");

  return (
    offlineCount >= RESTART_OFFLINE_THRESHOLD &&
    onlineCount <= RESTART_ONLINE_FLOOR &&
    isHealthySnapshot(lastHealthyStatus.payload)
  );
}

function withTransientRestartSnapshot(payload: NetworkStatusResponse) {
  return {
    ...payload,
    updated_at: new Date().toISOString(),
    source: "transient-restart-cache",
    summary: "degraded",
    note: "Short restart window detected; serving last healthy snapshot while probes recover.",
  };
}

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

async function buildNetworkStatus(): Promise<NetworkStatusResponse> {
  const results: NetworkStatusResponse = {
    updated_at: new Date().toISOString(),
    chain_id: NETWORK.chainId,
    evm_chain_id: NETWORK.evmChainIdHex,
    source: "live-probe",
  };

  await Promise.allSettled(
    Object.entries(ENDPOINTS).map(async ([key, config]) => {
      results[key] = await checkService(config);
    }),
  );

  const states = Object.keys(ENDPOINTS)
    .map((key) => (results[key] as ServiceStatus | undefined)?.status)
    .filter(Boolean) as ServiceState[];

  const onlineCount = states.filter((status) => status === "online").length;
  const degradedCount = states.filter((status) => status === "degraded").length;
  const offlineCount = states.filter((status) => status === "offline").length;

  results.summary = offlineCount > 0 ? "degraded" : degradedCount > 0 ? "degraded" : "healthy";
  results.online = onlineCount;
  results.degraded = degradedCount;
  results.offline = offlineCount;

  return results;
}

function storeSnapshot(payload: NetworkStatusResponse) {
  cachedStatus = { payload, fetchedAt: Date.now() };
  if (isHealthySnapshot(payload)) {
    lastHealthyStatus = { payload, fetchedAt: Date.now() };
  }
  return payload;
}

function getCachedSnapshot() {
  return cachedStatus?.payload ?? null;
}

function isTransientRestartPayload(payload: NetworkStatusResponse | null | undefined) {
  return payload?.source === "transient-restart-cache";
}

async function getNetworkStatusCached(forceRefresh = false) {
  const now = Date.now();

  if (
    !forceRefresh &&
    cachedStatus &&
    !isTransientRestartPayload(cachedStatus.payload) &&
    now - cachedStatus.fetchedAt < CACHE_TTL_MS
  ) {
    return cachedStatus.payload;
  }

  if (
    !forceRefresh &&
    cachedStatus &&
    !isTransientRestartPayload(cachedStatus.payload) &&
    now - cachedStatus.fetchedAt < REVALIDATE_AFTER_MS
  ) {
    if (!inFlightStatus) {
      inFlightStatus = buildNetworkStatus()
        .then((payload) => {
          if (shouldServeLastHealthySnapshot(payload) && lastHealthyStatus) {
            cachedStatus = {
              payload: withTransientRestartSnapshot(lastHealthyStatus.payload),
              fetchedAt: Date.now(),
            };
            return cachedStatus.payload;
          }
          return storeSnapshot(payload);
        })
        .finally(() => {
          inFlightStatus = null;
        });
    }
    return cachedStatus.payload;
  }

  if (!inFlightStatus) {
    inFlightStatus = buildNetworkStatus()
      .then((payload) => {
        if (shouldServeLastHealthySnapshot(payload) && lastHealthyStatus) {
          cachedStatus = {
            payload: withTransientRestartSnapshot(lastHealthyStatus.payload),
            fetchedAt: Date.now(),
          };
          return cachedStatus.payload;
        }
        return storeSnapshot(payload);
      })
      .finally(() => {
        inFlightStatus = null;
      });
  }

  return inFlightStatus;
}

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const forceRefresh = req.query?.refresh === "1";
    const status = await getNetworkStatusCached(forceRefresh);
    res.setHeader("Cache-Control", "s-maxage=10, stale-while-revalidate=20");
    return res.status(200).json(status);
  } catch (error) {
    const stale = getCachedSnapshot();
    if (stale) {
      res.setHeader("Cache-Control", "s-maxage=5, stale-while-revalidate=20");
      return res.status(200).json({
        ...stale,
        updated_at: new Date().toISOString(),
        source: "stale-cache",
      });
    }

    const message = error instanceof Error ? error.message : "unknown_error";
    return res.status(500).json({
      updated_at: new Date().toISOString(),
      chain_id: NETWORK.chainId,
      evm_chain_id: NETWORK.evmChainIdHex,
      source: "live-probe-error",
      summary: "offline",
      error: message,
    });
  }
}
