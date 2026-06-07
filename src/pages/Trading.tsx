import { useEffect, useMemo, useState } from "react";
import { Activity, ArrowRightLeft, Check, Copy, ExternalLink, RefreshCw, ShieldCheck, Wallet } from "lucide-react";
import { Button } from "../components/ui/button";
import { NETWORK } from "../constants/network";
import { addOrSwitchYnx, connectAccounts, encodeAddress, encodeApprove, encodeBalanceOf, encodeUint, formatUnits, parseUnits, publicEthCall, waitForTx } from "../lib/evm";

type Asset = {
  symbol: string;
  name: string;
  decimals: number;
  contract?: string;
  evmContract?: string;
  kind: string;
  status: string;
};

type Pair = {
  label: string;
  pair: string;
  feeBps: number;
  status: string;
};

type Registry = {
  assets: Asset[];
  pairs: Pair[];
  riskNotice: string;
};

const BRIDGE_ASSETS_URL = "https://rpc.ynxweb4.com/bridge/assets";
const AI_ACTION_RUN_URL = "https://ai.ynxweb4.com/ai/actions/run";
const PAIR_QUOTE = "0x8f79306e";
const PAIR_SWAP = "0xf3e6ea8a";
const YUSD = "YUSD.test";
const WUSDC = "wUSDC.y";
const WETH = "wETH.y";

function addressOf(asset?: Asset) {
  return asset?.contract || asset?.evmContract || "";
}

function encodeQuote(tokenIn: string, amountIn: bigint) {
  return `${PAIR_QUOTE}${encodeAddress(tokenIn)}${encodeUint(amountIn)}`;
}

function encodeSwap(tokenIn: string, amountIn: bigint, minAmountOut: bigint, recipient: string) {
  return `${PAIR_SWAP}${encodeAddress(tokenIn)}${encodeUint(amountIn)}${encodeUint(minAmountOut)}${encodeAddress(recipient)}`;
}

export function Trading() {
  const [registry, setRegistry] = useState<Registry | null>(null);
  const [account, setAccount] = useState("");
  const [fromSymbol, setFromSymbol] = useState(YUSD);
  const [toSymbol, setToSymbol] = useState(WUSDC);
  const [amount, setAmount] = useState("0.1");
  const [quote, setQuote] = useState<bigint | null>(null);
  const [balances, setBalances] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("Ready");
  const [aiStatus, setAiStatus] = useState("AI preflight loading...");
  const [preflight, setPreflight] = useState<any | null>(null);
  const [prepared, setPrepared] = useState<any | null>(null);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    fetch(BRIDGE_ASSETS_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`registry ${res.status}`);
        return res.json();
      })
      .then((json) => setRegistry(json))
      .catch((error) => setStatus(`Registry unavailable: ${error.message}`));
  }, []);

  const tradableAssets = useMemo(
    () => (registry?.assets || []).filter((asset) => [YUSD, WUSDC, WETH].includes(asset.symbol)),
    [registry],
  );

  const assetsBySymbol = useMemo(
    () => Object.fromEntries(tradableAssets.map((asset) => [asset.symbol, asset])),
    [tradableAssets],
  );

  const pair = useMemo(() => {
    if (!registry) return null;
    const wantsUsdc = [fromSymbol, toSymbol].includes(WUSDC);
    const wantsEth = [fromSymbol, toSymbol].includes(WETH);
    if (wantsUsdc) return registry.pairs.find((item) => item.label === "wUSDC.y/YUSD.test") || null;
    if (wantsEth) return registry.pairs.find((item) => item.label === "wETH.y/YUSD.test") || null;
    return null;
  }, [fromSymbol, registry, toSymbol]);

  const fromAsset = assetsBySymbol[fromSymbol];
  const toAsset = assetsBySymbol[toSymbol];
  const amountRaw = fromAsset ? parseUnits(amount, fromAsset.decimals) : 0n;
  const quoteDisplay = quote !== null && toAsset ? formatUnits(quote, toAsset.decimals, 8) : "-";

  async function connectWallet() {
    if (!window.ethereum) {
      setStatus("Wallet not found. Install MetaMask or another EVM wallet.");
      return;
    }
    await addOrSwitchYnx();
    const accounts = await connectAccounts();
    setAccount(accounts[0] || "");
    setStatus("Wallet connected");
  }

  async function refreshBalances(target = account) {
    if (!target) return;
    const next: Record<string, string> = {};
    for (const asset of tradableAssets) {
      const token = addressOf(asset);
      if (!token) continue;
      const raw = await publicEthCall(token, encodeBalanceOf(target));
      next[asset.symbol] = formatUnits(raw, asset.decimals, 8);
    }
    setBalances(next);
  }

  async function refreshQuote() {
    if (!pair || !fromAsset || !toAsset) return;
    const fromToken = addressOf(fromAsset);
    if (!fromToken || amountRaw <= 0n) {
      setQuote(null);
      return;
    }
    const raw = await publicEthCall(pair.pair, encodeQuote(fromToken, amountRaw));
    setQuote(raw);
  }

  async function refreshAiPreflight() {
    if (!fromAsset || !toAsset || !amount || Number(amount) <= 0) {
      setPreflight(null);
      setPrepared(null);
      return;
    }
    try {
      const preflightResponse = await fetch(AI_ACTION_RUN_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "trade.preflight", from_symbol: fromSymbol, to_symbol: toSymbol, amount }),
      });
      const preflightJson = await preflightResponse.json();
      if (!preflightResponse.ok || preflightJson.ok === false) throw new Error(preflightJson.error || `preflight ${preflightResponse.status}`);
      setPreflight(preflightJson.result);

      if (account) {
        const prepareResponse = await fetch(AI_ACTION_RUN_URL, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ action: "trade.prepare", from_symbol: fromSymbol, to_symbol: toSymbol, amount, recipient: account, slippage_bps: 100 }),
        });
        const prepareJson = await prepareResponse.json();
        if (prepareResponse.ok && prepareJson.ok !== false) setPrepared(prepareJson.result);
      } else {
        setPrepared(null);
      }
      setAiStatus("AI preflight ready");
    } catch (error) {
      setPreflight(null);
      setPrepared(null);
      setAiStatus(error instanceof Error ? error.message : "AI preflight unavailable");
    }
  }

  async function swap() {
    if (!window.ethereum || !account || !pair || !fromAsset || !toAsset) {
      setStatus("Connect wallet first");
      return;
    }
    if (amountRaw <= 0n) {
      setStatus("Enter an amount");
      return;
    }
    const fromToken = addressOf(fromAsset);
    setStatus(`Approving ${fromSymbol}...`);
    const approveHash = (await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [{ from: account, to: fromToken, data: encodeApprove(pair.pair, amountRaw), value: "0x0" }],
    })) as string;
    await waitForTx(approveHash);

    const liveQuote = await publicEthCall(pair.pair, encodeQuote(fromToken, amountRaw));
    const minOut = (liveQuote * 95n) / 100n;
    setStatus(`Swapping for at least ${formatUnits(minOut, toAsset.decimals, 8)} ${toSymbol}...`);
    const swapHash = (await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [{ from: account, to: pair.pair, data: encodeSwap(fromToken, amountRaw, minOut, account), value: "0x0" }],
    })) as string;
    await waitForTx(swapHash);
    setStatus(`Swap confirmed: ${swapHash}`);
    await refreshBalances(account);
    await refreshQuote();
  }

  useEffect(() => {
    void refreshQuote();
    void refreshAiPreflight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, amount, fromSymbol, pair?.pair, registry, toSymbol]);

  useEffect(() => {
    if (account && tradableAssets.length) void refreshBalances(account);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, registry]);

  function choosePair(nextTo: string) {
    setToSymbol(nextTo);
    if (nextTo === fromSymbol) setFromSymbol(YUSD);
  }

  function copy(value: string, label: string) {
    void navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1600);
  }

  return (
    <div className="min-h-screen pt-24 pb-24">
      <main className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[360px_1fr]">
        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-ink p-6 text-white shadow-xl">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-white/45">YNX Trading</p>
                <h1 className="mt-2 text-3xl font-display font-bold tracking-tight">Swap Pilot</h1>
              </div>
              <Activity className="text-emerald-300" />
            </div>
            <p className="text-sm leading-6 text-white/65">
              Live public-testnet AMM for YUSD.test, wUSDC.y, and wETH.y. Test assets have no mainnet value.
            </p>
            <Button onClick={connectWallet} className="mt-6 w-full justify-between rounded-xl" variant="klein">
              {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Connect Wallet"}
              <Wallet className="h-4 w-4" />
            </Button>
          </div>

          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Live Assets</h2>
              <Button size="icon" variant="ghost" onClick={() => account && refreshBalances()}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3">
              {tradableAssets.map((asset) => (
                <div key={asset.symbol} className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-border bg-surface px-3 py-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink">{asset.symbol}</p>
                    <p className="truncate text-[11px] text-ink/50">{asset.kind}</p>
                  </div>
                  <p className="shrink-0 font-mono text-xs text-ink/70">{balances[asset.symbol] || "-"}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section className="space-y-6">
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-ink/45">On-chain AMM</p>
                <h2 className="mt-1 text-2xl font-display font-bold">Swap</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant={toSymbol === WUSDC ? "klein" : "outline"} onClick={() => choosePair(WUSDC)}>
                  wUSDC Pair
                </Button>
                <Button variant={toSymbol === WETH ? "klein" : "outline"} onClick={() => choosePair(WETH)}>
                  wETH Pair
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
              <div className="rounded-xl border border-border bg-surface p-4">
                <label className="text-xs font-mono uppercase tracking-widest text-ink/45">From</label>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                  <input
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    className="min-w-0 flex-1 bg-transparent text-2xl font-semibold outline-none"
                    inputMode="decimal"
                  />
                  <select
                    value={fromSymbol}
                    onChange={(event) => setFromSymbol(event.target.value)}
                    className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm font-semibold sm:w-auto"
                  >
                    <option value={YUSD}>YUSD.test</option>
                    <option value={toSymbol}>{toSymbol}</option>
                  </select>
                </div>
              </div>
              <button
                onClick={() => {
                  setFromSymbol(toSymbol);
                  setToSymbol(fromSymbol === YUSD ? (toSymbol === WUSDC ? WUSDC : WETH) : YUSD);
                }}
                className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-ink shadow-sm hover:text-klein"
              >
                <ArrowRightLeft className="h-5 w-5" />
              </button>
              <div className="rounded-xl border border-border bg-surface p-4">
                <label className="text-xs font-mono uppercase tracking-widest text-ink/45">To</label>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="min-w-0 break-words text-2xl font-semibold">{quoteDisplay}</p>
                  <p className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm font-semibold sm:w-auto">{toSymbol}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-ink/55">{status}</p>
              <Button onClick={swap} variant="klein" className="w-full rounded-xl px-8 md:w-auto">
                Approve + Swap
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-klein" />
                  <p className="font-display text-xl font-semibold">AI Preflight</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-ink/60">
                  Quote, minOut, route status, liquidity, and test-asset risk before wallet signing. Agent execution remains Web4-policy gated.
                </p>
              </div>
              <Button size="sm" variant="outline" onClick={refreshAiPreflight}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
            <div className="grid gap-3 md:grid-cols-4">
              <div className="rounded-xl bg-surface p-3">
                <p className="text-xs text-ink/45">Pair</p>
                <p className="mt-1 font-semibold text-ink">{preflight?.pair?.label || pair?.label || "-"}</p>
              </div>
              <div className="rounded-xl bg-surface p-3">
                <p className="text-xs text-ink/45">AI quote</p>
                <p className="mt-1 font-mono text-sm text-ink">{preflight?.quote?.amount_out || "-"}</p>
              </div>
              <div className="rounded-xl bg-surface p-3">
                <p className="text-xs text-ink/45">minOut</p>
                <p className="mt-1 font-mono text-sm text-ink">{prepared?.min_out || "-"}</p>
              </div>
              <div className="rounded-xl bg-surface p-3">
                <p className="text-xs text-ink/45">Price impact</p>
                <p className="mt-1 font-mono text-sm text-ink">{preflight?.quote?.liquidity?.price_impact_bps ?? "-"} bps</p>
              </div>
            </div>
            <div className="mt-3 rounded-xl border border-border bg-surface p-3">
              <p className="text-xs font-mono uppercase tracking-widest text-ink/45">{aiStatus}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(preflight?.routes || []).map((route: any) => (
                  <span key={route.routeId} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink/65">
                    {route.routeId}: {route.phase}
                  </span>
                ))}
              </div>
              {!!preflight?.warnings?.length && (
                <ul className="mt-3 space-y-1 text-sm text-amber-800">
                  {preflight.warnings.slice(0, 4).map((warning: string) => <li key={warning}>{warning}</li>)}
                </ul>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {(registry?.pairs || []).map((item) => (
              <div key={item.pair} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <p className="font-display text-lg font-semibold">{item.label}</p>
                    <p className="mt-1 text-xs font-mono uppercase tracking-widest text-emerald-600">
                      {item.status} / {item.feeBps} bps
                    </p>
                  </div>
                  <a href={`${NETWORK.endpoints.explorer}/address/${item.pair}`} target="_blank" rel="noreferrer" className="text-ink/45 hover:text-klein">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                <button
                  onClick={() => copy(item.pair, item.label)}
                  className="flex w-full min-w-0 items-center justify-between gap-2 rounded-xl bg-surface px-3 py-2 text-left font-mono text-xs text-ink/70"
                >
                  <span className="truncate">{item.pair}</span>
                  {copied === item.label ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
            {registry?.riskNotice || "Public-testnet assets and AMM pairs are for testing only."}
          </div>
        </section>
      </main>
    </div>
  );
}
