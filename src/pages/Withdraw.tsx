import { useEffect, useMemo, useState } from "react";
import { ArrowUpFromLine, CheckCircle2, ExternalLink, RefreshCw, Wallet } from "lucide-react";
import { Button } from "../components/ui/button";
import { NETWORK } from "../constants/network";
import { fetchJsonWithTimeout } from "../lib/request";
import {
  addOrSwitchYnx,
  connectAccounts,
  encodeApprove,
  encodeBalanceOf,
  encodeBurnForBridgeMapped,
  formatUnits,
  parseUnits,
  publicEthCall,
  waitForTx,
} from "../lib/evm";

type Route = {
  routeId: string;
  displayName: string;
  sourceKind: string;
  sourceChainId: string;
  sourceAssetId: string;
  sourceContract?: string;
  wrappedToken: string;
  wrappedSymbol: string;
  decimals: number;
  lockboxAddress?: string;
};

type Withdrawal = {
  withdrawal_id: string;
  route_id: string;
  amount: string;
  destination_recipient: string;
  burn_tx_hash: string;
  status: string;
  release?: { tx_hash?: string; block_number?: number };
};

type RouteReadinessResponse = {
  ok: boolean;
  items: Array<{
    routeId: string;
    phase: string;
    automatic_loop_ready?: boolean;
    blockers?: string[];
    evidence?: {
      release_adapter_status?: { status?: string; adapter?: string };
      withdrawal_watcher?: { last_scan_at?: string; releases_executed?: number; last_error?: string };
    };
  }>;
};

const BRIDGE_ROUTES_URL = "https://rpc.ynxweb4.com/bridge/routes";
const BRIDGE_WITHDRAWALS_URL = "https://rpc.ynxweb4.com/bridge/withdrawals";
const BRIDGE_READINESS_URL = "https://rpc.ynxweb4.com/bridge/route-readiness";
const GATEWAY_ADDRESS = "0x3a2948da8f35b86dce1440ebfb56b8ae041cebfe";
const SEPOLIA_EXPLORER = "https://sepolia.etherscan.io";

function addressToBytes32(address: string) {
  return `0x${"0".repeat(24)}${address.replace(/^0x/, "").toLowerCase()}`;
}

export function Withdraw() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [routeId, setRouteId] = useState("eth-sepolia-usdc");
  const [account, setAccount] = useState("");
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("0.01");
  const [balance, setBalance] = useState("-");
  const [status, setStatus] = useState("Ready");
  const [burnTx, setBurnTx] = useState("");
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [readiness, setReadiness] = useState<RouteReadinessResponse | null>(null);

  useEffect(() => {
    fetchJsonWithTimeout<{ items?: Route[] }>(BRIDGE_ROUTES_URL, { timeoutMs: 3500 })
      .then((json) => setRoutes((json.items || []).filter((item: Route) => item.sourceKind === "evm" && item.lockboxAddress)))
      .catch((error) => setStatus(`Routes unavailable: ${error.message}`));
  }, []);

  const route = useMemo(() => routes.find((item) => item.routeId === routeId) || routes[0], [routeId, routes]);
  const amountRaw = route ? parseUnits(amount, route.decimals) : 0n;

  async function connectWallet() {
    await addOrSwitchYnx();
    const accounts = await connectAccounts();
    setAccount(accounts[0] || "");
    setDestination(accounts[0] || "");
    setStatus("YNX wallet connected");
  }

  async function refresh() {
    if (route && account) {
      const raw = await publicEthCall(route.wrappedToken, encodeBalanceOf(account));
      setBalance(formatUnits(raw, route.decimals, 8));
    }
    const [json, readinessJson] = await Promise.all([
      fetchJsonWithTimeout<{ items?: Withdrawal[] }>(BRIDGE_WITHDRAWALS_URL, { timeoutMs: 3500 }),
      fetchJsonWithTimeout<RouteReadinessResponse>(BRIDGE_READINESS_URL, { timeoutMs: 3500 }).catch(() => null),
    ]);
    setWithdrawals(json.items || []);
    if (readinessJson?.ok) setReadiness(readinessJson);
  }

  async function withdraw() {
    if (!window.ethereum || !account || !route) {
      setStatus("Connect YNX wallet first");
      return;
    }
    if (!/^0x[0-9a-fA-F]{40}$/.test(destination)) {
      setStatus("Enter a valid Sepolia recipient address");
      return;
    }
    if (amountRaw <= 0n) {
      setStatus("Enter an amount");
      return;
    }
    await addOrSwitchYnx();
    setStatus(`Approving ${route.wrappedSymbol}...`);
    const approveHash = (await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [{ from: account, to: route.wrappedToken, data: encodeApprove(GATEWAY_ADDRESS, amountRaw), value: "0x0" }],
    })) as string;
    await waitForTx(approveHash);

    setStatus(`Burning ${route.wrappedSymbol} for Sepolia release...`);
    const hash = (await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [{
        from: account,
        to: GATEWAY_ADDRESS,
        data: encodeBurnForBridgeMapped(route.wrappedToken, amountRaw, route.sourceChainId, addressToBytes32(destination)),
        value: "0x0",
      }],
    })) as string;
    setBurnTx(hash);
    await waitForTx(hash);
    setStatus("Burn confirmed. Withdrawal watcher will release on Sepolia automatically.");
    await refresh();
  }

  useEffect(() => {
    if (account && route) void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, routeId, routes.length]);

  const matchingWithdrawals = withdrawals.filter((item) => !burnTx || item.burn_tx_hash.toLowerCase() === burnTx.toLowerCase()).slice(0, 5);
  const routeReadiness = route ? readiness?.items?.find((item) => item.routeId === route.routeId) : null;

  return (
    <div className="min-h-screen pt-24 pb-24">
      <main className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[360px_1fr]">
        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-ink p-6 text-white shadow-xl">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-white/45">YNX Bridge</p>
                <h1 className="mt-2 text-3xl font-display font-bold tracking-tight">Withdraw</h1>
              </div>
              <ArrowUpFromLine className="text-emerald-300" />
            </div>
            <p className="text-sm leading-6 text-white/65">
              Burn wrapped public-testnet assets on YNX and inspect the route release adapter before source-chain release.
            </p>
            <Button onClick={connectWallet} className="mt-6 w-full justify-between rounded-xl" variant="klein">
              {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Connect YNX"}
              <Wallet className="h-4 w-4" />
            </Button>
          </div>

          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <h2 className="font-display text-lg font-semibold">Balance</h2>
            <div className="mt-4 rounded-xl border border-border bg-surface px-3 py-2">
              <p className="text-xs text-ink/50">{route?.wrappedSymbol || "Wrapped asset"}</p>
              <p className="font-mono text-sm text-ink">{balance}</p>
            </div>
            <Button size="sm" variant="outline" className="mt-4 w-full" onClick={refresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </aside>

        <section className="space-y-6">
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <div className="mb-6">
              <p className="text-xs font-mono uppercase tracking-widest text-ink/45">YNX to source</p>
              <h2 className="mt-1 text-2xl font-display font-bold">Release to Sepolia</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="rounded-xl border border-border bg-surface p-4">
                <span className="text-xs font-mono uppercase tracking-widest text-ink/45">Route</span>
                <select value={route?.routeId || routeId} onChange={(event) => setRouteId(event.target.value)} className="mt-3 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm font-semibold">
                  {routes.map((item) => (
                    <option key={item.routeId} value={item.routeId}>{item.wrappedSymbol} to {item.displayName}</option>
                  ))}
                </select>
              </label>
              <label className="rounded-xl border border-border bg-surface p-4">
                <span className="text-xs font-mono uppercase tracking-widest text-ink/45">Amount</span>
                <input value={amount} onChange={(event) => setAmount(event.target.value)} inputMode="decimal" className="mt-3 w-full bg-transparent text-2xl font-semibold outline-none" />
              </label>
            </div>
            <label className="mt-4 block rounded-xl border border-border bg-surface p-4">
              <span className="text-xs font-mono uppercase tracking-widest text-ink/45">Sepolia recipient</span>
              <input value={destination} onChange={(event) => setDestination(event.target.value)} placeholder="0x..." className="mt-3 w-full bg-transparent font-mono text-sm outline-none" />
            </label>
            <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <p className="break-words text-sm text-ink/55">{status}</p>
              <Button onClick={withdraw} variant="klein" className="rounded-xl px-8">Approve / Burn</Button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">Withdrawal Status</h3>
              <Button size="sm" variant="ghost" onClick={refresh}>Refresh</Button>
            </div>
            {routeReadiness && (
              <div className="mt-4 rounded-xl border border-border bg-surface p-3">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink/65">{routeReadiness.phase}</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${routeReadiness.automatic_loop_ready ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                    {routeReadiness.evidence?.release_adapter_status?.status || "release status unknown"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-ink/60">
                  watcher last scan: {routeReadiness.evidence?.withdrawal_watcher?.last_scan_at || "-"} / releases: {routeReadiness.evidence?.withdrawal_watcher?.releases_executed ?? "-"}
                </p>
                {!!routeReadiness.blockers?.length && <p className="mt-2 break-words font-mono text-xs text-amber-700">{routeReadiness.blockers.join(", ")}</p>}
              </div>
            )}
            <div className="mt-4 space-y-3">
              {matchingWithdrawals.length === 0 ? (
                <p className="text-sm text-ink/55">No matching withdrawal yet. The watcher scans automatically.</p>
              ) : matchingWithdrawals.map((item) => (
                <div key={item.withdrawal_id} className="rounded-xl bg-surface p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-mono text-xs text-ink/60">{item.withdrawal_id.slice(0, 12)}...{item.withdrawal_id.slice(-8)}</p>
                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold uppercase text-emerald-700">{item.status}</span>
                  </div>
                  <p className="mt-2 text-sm text-ink">{item.amount} to {item.destination_recipient.slice(0, 6)}...{item.destination_recipient.slice(-4)}</p>
                  {item.release?.tx_hash && (
                    <a href={`${SEPOLIA_EXPLORER}/tx/${item.release.tx_hash}`} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center text-sm text-klein">
                      Sepolia release <ExternalLink className="ml-1 h-4 w-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900">
            <CheckCircle2 className="mb-2 h-4 w-4" />
            Release automation is route-specific. Sepolia uses source lockboxes; BTC/TRON require configured public-testnet signer adapters; all assets here have no mainnet value.
          </div>
        </section>
      </main>
    </div>
  );
}
