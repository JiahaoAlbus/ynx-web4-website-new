import { useEffect, useMemo, useState } from "react";
import { ArrowDownToLine, Check, Copy, ExternalLink, RefreshCw, ShieldCheck, Wallet } from "lucide-react";
import { Button } from "../components/ui/button";
import { NETWORK } from "../constants/network";
import {
  addOrSwitchEvmChain,
  addOrSwitchYnx,
  connectAccounts,
  encodeApprove,
  encodeBalanceOf,
  encodeDepositERC20,
  encodeDepositNative,
  formatUnits,
  parseUnits,
  publicEthCall,
  waitForTx,
} from "../lib/evm";

type Route = {
  routeId: string;
  asset: string;
  displayName: string;
  sourceKind: string;
  sourceNetwork: string;
  sourceChainId: string;
  sourceAssetId: string;
  sourceContract?: string;
  wrappedToken: string;
  wrappedSymbol: string;
  decimals: number;
  minConfirmations: number;
  rpc: string;
  lockboxAddress?: string;
};

type RoutesResponse = {
  routes?: Route[];
  items?: Route[];
};

type WatcherResponse = {
  ok: boolean;
  items: Record<string, {
    last_scanned_block?: number;
    last_scan_at?: string;
    last_error?: string;
    events_seen?: number;
    deposits_minted?: number;
  }>;
};

type RouteReadinessResponse = {
  ok: boolean;
  summary?: { routes?: number; full_loop_tested?: number; automatic_loop_ready?: number };
  items: Array<{
    routeId: string;
    phase: string;
    automatic_loop_ready?: boolean;
    blockers?: string[];
    evidence?: {
      deposit_watcher_status?: { status?: string; adapter?: string };
      release_adapter_status?: { status?: string; adapter?: string };
    };
  }>;
};

const BRIDGE_ROUTES_URL = "https://rpc.ynxweb4.com/bridge/routes";
const BRIDGE_WATCHERS_URL = "https://rpc.ynxweb4.com/bridge/watchers";
const BRIDGE_READINESS_URL = "https://rpc.ynxweb4.com/bridge/route-readiness";
const SEPOLIA_CHAIN_ID_HEX = "0xaa36a7";
const SEPOLIA_EXPLORER = "https://sepolia.etherscan.io";

function shortHash(value: string) {
  return value ? `${value.slice(0, 10)}...${value.slice(-8)}` : "";
}

export function Bridge() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [routeId, setRouteId] = useState("eth-sepolia-usdc");
  const [account, setAccount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("0.1");
  const [sourceBalance, setSourceBalance] = useState("-");
  const [ynxBalance, setYnxBalance] = useState("-");
  const [watchers, setWatchers] = useState<WatcherResponse["items"]>({});
  const [readiness, setReadiness] = useState<RouteReadinessResponse | null>(null);
  const [status, setStatus] = useState("Ready");
  const [lastTx, setLastTx] = useState("");
  const [copied, setCopied] = useState("");

  useEffect(() => {
    fetch(BRIDGE_ROUTES_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`routes ${res.status}`);
        return res.json();
      })
      .then((json: RoutesResponse) => setRoutes((json.routes || json.items || []).filter((item) => item.sourceKind === "evm" && item.lockboxAddress)))
      .catch((error) => setStatus(`Bridge routes unavailable: ${error.message}`));
  }, []);

  useEffect(() => {
    let mounted = true;
    async function refreshWatchers() {
      try {
        const response = await fetch(BRIDGE_WATCHERS_URL);
        const [json, readinessResponse] = await Promise.all([
          response.json() as Promise<WatcherResponse>,
          fetch(BRIDGE_READINESS_URL).then((res) => res.json() as Promise<RouteReadinessResponse>),
        ]);
        if (mounted && json.ok) setWatchers(json.items || {});
        if (mounted && readinessResponse.ok) setReadiness(readinessResponse);
      } catch {
        if (mounted) setStatus("Watcher status unavailable");
      }
    }
    void refreshWatchers();
    const id = window.setInterval(refreshWatchers, 30000);
    return () => {
      mounted = false;
      window.clearInterval(id);
    };
  }, []);

  const route = useMemo(() => routes.find((item) => item.routeId === routeId) || routes[0], [routeId, routes]);
  const amountRaw = route ? parseUnits(amount, route.decimals) : 0n;

  async function connectSourceWallet() {
    await addOrSwitchEvmChain({
      chainIdHex: SEPOLIA_CHAIN_ID_HEX,
      chainName: "Ethereum Sepolia",
      nativeCurrency: { name: "Sepolia ETH", symbol: "ETH", decimals: 18 },
      rpcUrls: ["https://ethereum-sepolia-rpc.publicnode.com"],
      blockExplorerUrls: [SEPOLIA_EXPLORER],
    });
    const accounts = await connectAccounts();
    setAccount(accounts[0] || "");
    setRecipient(accounts[0] || "");
    setStatus("Sepolia wallet connected");
  }

  async function refreshBalances(target = account, targetRecipient = recipient || account) {
    if (!route || !target) return;
    if (route.sourceContract) {
      const raw = await publicEthCall(route.sourceContract, encodeBalanceOf(target), route.rpc);
      setSourceBalance(formatUnits(raw, route.decimals, 8));
    } else {
      const response = await fetch(route.rpc, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: Date.now(), method: "eth_getBalance", params: [target, "latest"] }),
      });
      const json = await response.json();
      setSourceBalance(formatUnits(BigInt(json.result || "0x0"), route.decimals, 8));
    }
    if (targetRecipient) {
      const wrappedRaw = await publicEthCall(route.wrappedToken, encodeBalanceOf(targetRecipient));
      setYnxBalance(formatUnits(wrappedRaw, route.decimals, 8));
    }
  }

  async function deposit() {
    if (!window.ethereum || !route || !route.lockboxAddress || !account) {
      setStatus("Connect Sepolia wallet first");
      return;
    }
    if (!recipient || !/^0x[0-9a-fA-F]{40}$/.test(recipient)) {
      setStatus("Enter a valid YNX EVM recipient address");
      return;
    }
    if (amountRaw <= 0n) {
      setStatus("Enter an amount");
      return;
    }

    await addOrSwitchEvmChain({
      chainIdHex: SEPOLIA_CHAIN_ID_HEX,
      chainName: "Ethereum Sepolia",
      nativeCurrency: { name: "Sepolia ETH", symbol: "ETH", decimals: 18 },
      rpcUrls: ["https://ethereum-sepolia-rpc.publicnode.com"],
      blockExplorerUrls: [SEPOLIA_EXPLORER],
    });

    if (route.sourceContract) {
      setStatus(`Approving ${route.displayName}...`);
      const approveHash = (await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [{ from: account, to: route.sourceContract, data: encodeApprove(route.lockboxAddress, amountRaw), value: "0x0" }],
      })) as string;
      await waitForTx(approveHash, route.rpc);
      setStatus(`Locking ${route.displayName} in source lockbox...`);
      const lockHash = (await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [{ from: account, to: route.lockboxAddress, data: encodeDepositERC20(route.sourceAssetId, amountRaw, recipient), value: "0x0" }],
      })) as string;
      setLastTx(lockHash);
      await waitForTx(lockHash, route.rpc);
    } else {
      setStatus(`Locking ${route.displayName} in source lockbox...`);
      const lockHash = (await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [{ from: account, to: route.lockboxAddress, data: encodeDepositNative(route.sourceAssetId, recipient), value: `0x${amountRaw.toString(16)}` }],
      })) as string;
      setLastTx(lockHash);
      await waitForTx(lockHash, route.rpc);
    }

    setStatus("Deposit confirmed on Sepolia. Watcher will mint on YNX after scan.");
    await refreshBalances(account, recipient);
  }

  async function copy(value: string, label: string) {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1400);
  }

  async function addYnxNetwork() {
    await addOrSwitchYnx();
    setStatus("YNX network added to wallet");
  }

  const watcher = route ? watchers[route.routeId] : undefined;
  const routeReadiness = route ? readiness?.items?.find((item) => item.routeId === route.routeId) : null;

  return (
    <div className="min-h-screen pt-24 pb-24">
      <main className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[360px_1fr]">
        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-ink p-6 text-white shadow-xl">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-white/45">YNX Bridge</p>
                <h1 className="mt-2 text-3xl font-display font-bold tracking-tight">Deposit</h1>
              </div>
              <ArrowDownToLine className="text-emerald-300" />
            </div>
            <p className="text-sm leading-6 text-white/65">
              Lock supported public-testnet source assets, then mint their wrapped test representation on YNX. Non-Sepolia routes show readiness and automation status before use.
            </p>
            <Button onClick={connectSourceWallet} className="mt-6 w-full justify-between rounded-xl" variant="klein">
              {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Connect Sepolia"}
              <Wallet className="h-4 w-4" />
            </Button>
          </div>

          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <h2 className="font-display text-lg font-semibold">Balances</h2>
            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-border bg-surface px-3 py-2">
                <p className="text-xs text-ink/50">Source balance</p>
                <p className="font-mono text-sm text-ink">{sourceBalance} {route?.asset || ""}</p>
              </div>
              <div className="rounded-xl border border-border bg-surface px-3 py-2">
                <p className="text-xs text-ink/50">YNX wrapped balance</p>
                <p className="font-mono text-sm text-ink">{ynxBalance} {route?.wrappedSymbol || ""}</p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="mt-4 w-full" onClick={() => refreshBalances()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </aside>

        <section className="space-y-6">
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-ink/45">Source to YNX</p>
                <h2 className="mt-1 text-2xl font-display font-bold">Sepolia Bridge</h2>
              </div>
              <Button variant="outline" onClick={addYnxNetwork}>Add YNX Network</Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="rounded-xl border border-border bg-surface p-4">
                <span className="text-xs font-mono uppercase tracking-widest text-ink/45">Route</span>
                <select value={route?.routeId || routeId} onChange={(event) => setRouteId(event.target.value)} className="mt-3 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm font-semibold">
                  {routes.map((item) => (
                    <option key={item.routeId} value={item.routeId}>
                      {item.displayName} to {item.wrappedSymbol}
                    </option>
                  ))}
                </select>
              </label>
              <label className="rounded-xl border border-border bg-surface p-4">
                <span className="text-xs font-mono uppercase tracking-widest text-ink/45">Amount</span>
                <input value={amount} onChange={(event) => setAmount(event.target.value)} inputMode="decimal" className="mt-3 w-full bg-transparent text-2xl font-semibold outline-none" />
              </label>
            </div>

            <label className="mt-4 block rounded-xl border border-border bg-surface p-4">
              <span className="text-xs font-mono uppercase tracking-widest text-ink/45">YNX recipient</span>
              <input value={recipient} onChange={(event) => setRecipient(event.target.value)} placeholder="0x..." className="mt-3 w-full bg-transparent font-mono text-sm outline-none" />
            </label>

            <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <p className="break-words text-sm text-ink/55">{status}</p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button onClick={deposit} variant="klein" className="rounded-xl px-8">Approve / Deposit</Button>
                <Button onClick={() => refreshBalances()} variant="outline" className="rounded-xl px-8">Refresh</Button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-ink/45">Automated Watcher</p>
                <h3 className="mt-1 font-display text-lg font-semibold">{route?.routeId || "No route selected"}</h3>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${watcher?.last_error ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
                {watcher?.last_error ? "Error" : "Live"}
              </span>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-xl bg-surface px-3 py-2">
                <p className="text-xs text-ink/45">Last scanned block</p>
                <p className="font-mono text-sm text-ink">{watcher?.last_scanned_block || "-"}</p>
              </div>
              <div className="rounded-xl bg-surface px-3 py-2">
                <p className="text-xs text-ink/45">Deposits minted</p>
                <p className="font-mono text-sm text-ink">{watcher?.deposits_minted ?? "-"}</p>
              </div>
              <div className="rounded-xl bg-surface px-3 py-2">
                <p className="text-xs text-ink/45">Last scan</p>
                <p className="truncate font-mono text-sm text-ink">{watcher?.last_scan_at || "-"}</p>
              </div>
            </div>
            {watcher?.last_error && <p className="mt-3 break-words text-sm text-red-700">{watcher.last_error}</p>}
            {routeReadiness && (
              <div className="mt-4 rounded-xl border border-border bg-surface p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink/65">{routeReadiness.phase}</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${routeReadiness.automatic_loop_ready ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                    automatic {routeReadiness.automatic_loop_ready ? "ready" : "pending"}
                  </span>
                </div>
                <p className="mt-3 text-sm text-ink/60">
                  deposit watcher: {routeReadiness.evidence?.deposit_watcher_status?.status || "-"} / release adapter: {routeReadiness.evidence?.release_adapter_status?.status || "-"}
                </p>
                {!!routeReadiness.blockers?.length && <p className="mt-2 break-words font-mono text-xs text-amber-700">{routeReadiness.blockers.join(", ")}</p>}
              </div>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {route && (
              <>
                <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                  <p className="font-display text-lg font-semibold">Source Lockbox</p>
                  <button onClick={() => copy(route.lockboxAddress || "", "lockbox")} className="mt-4 flex w-full min-w-0 items-center justify-between gap-2 rounded-xl bg-surface px-3 py-2 text-left font-mono text-xs text-ink/70">
                    <span className="truncate">{route.lockboxAddress}</span>
                    {copied === "lockbox" ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                  <p className="font-display text-lg font-semibold">Wrapped Asset</p>
                  <button onClick={() => copy(route.wrappedToken, "wrapped")} className="mt-4 flex w-full min-w-0 items-center justify-between gap-2 rounded-xl bg-surface px-3 py-2 text-left font-mono text-xs text-ink/70">
                    <span className="truncate">{route.wrappedToken}</span>
                    {copied === "wrapped" ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </>
            )}
          </div>

          {lastTx && (
            <a href={`${SEPOLIA_EXPLORER}/tx/${lastTx}`} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-2xl border border-border bg-white p-5 text-sm shadow-sm hover:text-klein">
              <span>Last Sepolia deposit: {shortHash(lastTx)}</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          )}

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
            <ShieldCheck className="mb-2 h-4 w-4" />
            Public-testnet bridge routes are for testing only. AI/readiness panels show whether a route has automatic watcher and signer-gated release configured; missing BSC lockbox, BTC/TRON deposit address, contract, or signer blocks automatic PASS.
          </div>
        </section>
      </main>
    </div>
  );
}
