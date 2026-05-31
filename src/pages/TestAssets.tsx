import { useEffect, useMemo, useState } from "react";
import { Check, Copy, Droplets, ExternalLink, Plus, RefreshCw, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { NETWORK } from "../constants/network";
import { addOrSwitchYnx, connectAccounts, encodeBalanceOf, formatUnits, publicEthCall } from "../lib/evm";

type Asset = {
  symbol: string;
  name: string;
  decimals: number;
  contract?: string;
  evmContract?: string;
  denom?: string;
  kind: string;
  status: string;
  redeemable?: boolean;
  mainnetValue?: boolean;
};

type Registry = {
  assets: Asset[];
  riskNotice: string;
};

const BRIDGE_ASSETS_URL = "https://rpc.ynxweb4.com/bridge/assets";

function tokenAddress(asset: Asset) {
  return asset.contract || asset.evmContract || "";
}

export function TestAssets() {
  const [registry, setRegistry] = useState<Registry | null>(null);
  const [account, setAccount] = useState("");
  const [balances, setBalances] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("Ready");
  const [copied, setCopied] = useState("");

  useEffect(() => {
    fetch(BRIDGE_ASSETS_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`assets ${res.status}`);
        return res.json();
      })
      .then((json) => setRegistry(json))
      .catch((error) => setStatus(`Asset registry unavailable: ${error.message}`));
  }, []);

  const assets = useMemo(() => registry?.assets || [], [registry]);

  async function connectWallet() {
    await addOrSwitchYnx();
    const accounts = await connectAccounts();
    setAccount(accounts[0] || "");
    setStatus("YNX wallet connected");
  }

  async function refreshBalances(target = account) {
    if (!target) return;
    const next: Record<string, string> = {};
    for (const asset of assets) {
      const address = tokenAddress(asset);
      if (!address) continue;
      const raw = await publicEthCall(address, encodeBalanceOf(target));
      next[asset.symbol] = formatUnits(raw, asset.decimals, 8);
    }
    setBalances(next);
  }

  async function requestNyxt() {
    if (!account) {
      setStatus("Connect wallet first");
      return;
    }
    setStatus("Requesting NYXT from faucet...");
    const response = await fetch(`${NETWORK.endpoints.faucet}/faucet`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ address: account }),
    });
    const json = await response.json();
    if (!response.ok || !json.ok) {
      setStatus(`Faucet rejected: ${json.error || response.status}`);
      return;
    }
    setStatus(`Faucet sent ${json.amount}; tx ${json.txhash}`);
    await refreshBalances(account);
  }

  async function watchAsset(asset: Asset) {
    const address = tokenAddress(asset);
    if (!window.ethereum || !address) return;
    await window.ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address,
          symbol: asset.symbol.slice(0, 11),
          decimals: asset.decimals,
          image: "https://www.ynxweb4.com/favicon.svg",
        },
      },
    });
  }

  async function copy(value: string, label: string) {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1400);
  }

  useEffect(() => {
    if (account && assets.length) void refreshBalances(account);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, registry]);

  return (
    <div className="min-h-screen pt-24 pb-24">
      <main className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[360px_1fr]">
        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-ink p-6 text-white shadow-xl">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-white/45">YNX Assets</p>
                <h1 className="mt-2 text-3xl font-display font-bold tracking-tight">Test Assets</h1>
              </div>
              <Droplets className="text-emerald-300" />
            </div>
            <p className="text-sm leading-6 text-white/65">
              One place to fund gas, add live test tokens to your wallet, and jump into bridge or swap flows.
            </p>
            <Button onClick={connectWallet} className="mt-6 w-full justify-between rounded-xl" variant="klein">
              {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Connect YNX"}
              <Wallet className="h-4 w-4" />
            </Button>
          </div>

          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <h2 className="font-display text-lg font-semibold">Fast Actions</h2>
            <div className="mt-4 space-y-3">
              <Button onClick={requestNyxt} variant="klein" className="w-full rounded-xl">
                <Droplets className="mr-2 h-4 w-4" />
                Request NYXT Gas
              </Button>
              <Button onClick={() => refreshBalances()} variant="outline" className="w-full rounded-xl">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Balances
              </Button>
            </div>
            <p className="mt-4 break-words text-sm text-ink/55">{status}</p>
          </div>
        </aside>

        <section className="space-y-6">
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <div className="mb-6">
              <p className="text-xs font-mono uppercase tracking-widest text-ink/45">Live Registry</p>
              <h2 className="mt-1 text-2xl font-display font-bold">YNX Public Testnet Assets</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {assets.map((asset) => {
                const address = tokenAddress(asset);
                return (
                  <div key={asset.symbol} className="rounded-2xl border border-border bg-surface p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-display text-lg font-semibold">{asset.symbol}</p>
                        <p className="mt-1 truncate text-xs text-ink/50">{asset.kind}</p>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold uppercase text-emerald-700">{asset.status}</span>
                    </div>
                    <div className="mt-4 rounded-xl border border-border bg-white px-3 py-2">
                      <p className="text-xs text-ink/45">Balance</p>
                      <p className="font-mono text-sm text-ink">{balances[asset.symbol] || "-"}</p>
                    </div>
                    {address && (
                      <button onClick={() => copy(address, asset.symbol)} className="mt-3 flex w-full min-w-0 items-center justify-between gap-2 rounded-xl bg-white px-3 py-2 text-left font-mono text-xs text-ink/70">
                        <span className="truncate">{address}</span>
                        {copied === asset.symbol ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                      </button>
                    )}
                    <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                      {address && (
                        <Button variant="outline" size="sm" onClick={() => watchAsset(asset)} className="rounded-xl">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Token
                        </Button>
                      )}
                      {address && (
                        <Button variant="ghost" size="sm" asChild className="rounded-xl">
                          <a href={`${NETWORK.endpoints.explorer}/address/${address}`} target="_blank" rel="noreferrer">
                            Explorer <ExternalLink className="ml-2 h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Link to="/bridge" className="rounded-2xl border border-border bg-white p-5 shadow-sm transition hover:border-klein/40">
              <p className="font-display text-lg font-semibold">Bridge Sepolia Assets</p>
              <p className="mt-2 text-sm leading-6 text-ink/60">Deposit Sepolia ETH or Circle Sepolia USDC to mint wETH.y or wUSDC.y on YNX.</p>
            </Link>
            <Link to="/trading" className="rounded-2xl border border-border bg-white p-5 shadow-sm transition hover:border-klein/40">
              <p className="font-display text-lg font-semibold">Get YUSD.test Through Swap</p>
              <p className="mt-2 text-sm leading-6 text-ink/60">YUSD.test is a synthetic test stable asset. It is not redeemable and should not be treated as real USD.</p>
            </Link>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
            {registry?.riskNotice || "Public-testnet assets are for testing only. They have no mainnet value."}
          </div>
        </section>
      </main>
    </div>
  );
}

