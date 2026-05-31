import { NETWORK } from "../constants/network";

export type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] | Record<string, unknown> }) => Promise<unknown>;
};

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export const ERC20_BALANCE_OF = "0x70a08231";
export const ERC20_APPROVE = "0x095ea7b3";
export const ERC20_ALLOWANCE = "0xdd62ed3e";
export const LOCKBOX_DEPOSIT_NATIVE = "0x80a6de92";
export const LOCKBOX_DEPOSIT_ERC20 = "0x5846b1e2";

export function strip0x(value: string) {
  return value.startsWith("0x") ? value.slice(2) : value;
}

export function pad64(value: string) {
  return strip0x(value).padStart(64, "0");
}

export function encodeAddress(address: string) {
  return pad64(address.toLowerCase());
}

export function encodeBytes32(value: string) {
  return pad64(value);
}

export function encodeUint(value: bigint) {
  return value.toString(16).padStart(64, "0");
}

export function encodeBalanceOf(account: string) {
  return `${ERC20_BALANCE_OF}${encodeAddress(account)}`;
}

export function encodeApprove(spender: string, amount: bigint) {
  return `${ERC20_APPROVE}${encodeAddress(spender)}${encodeUint(amount)}`;
}

export function encodeAllowance(owner: string, spender: string) {
  return `${ERC20_ALLOWANCE}${encodeAddress(owner)}${encodeAddress(spender)}`;
}

export function encodeDepositNative(sourceAssetId: string, recipient: string) {
  return `${LOCKBOX_DEPOSIT_NATIVE}${encodeBytes32(sourceAssetId)}${encodeAddress(recipient)}`;
}

export function encodeDepositERC20(sourceAssetId: string, amount: bigint, recipient: string) {
  return `${LOCKBOX_DEPOSIT_ERC20}${encodeBytes32(sourceAssetId)}${encodeUint(amount)}${encodeAddress(recipient)}`;
}

export function parseUnits(value: string, decimals: number) {
  const clean = value.trim();
  if (!/^\d*(\.\d*)?$/.test(clean) || clean === "" || clean === ".") return 0n;
  const [wholeRaw, fractionRaw = ""] = clean.split(".");
  const whole = wholeRaw || "0";
  const fraction = fractionRaw.slice(0, decimals).padEnd(decimals, "0");
  return BigInt(whole) * 10n ** BigInt(decimals) + BigInt(fraction || "0");
}

export function formatUnits(value: bigint, decimals: number, precision = 6) {
  const base = 10n ** BigInt(decimals);
  const whole = value / base;
  const fraction = value % base;
  if (fraction === 0n) return whole.toString();
  const padded = fraction.toString().padStart(decimals, "0");
  const trimmed = padded.slice(0, precision).replace(/0+$/, "");
  return trimmed ? `${whole}.${trimmed}` : whole.toString();
}

export async function publicEthCall(to: string, data: string, rpcUrl = NETWORK.endpoints.evm) {
  const response = await fetch(rpcUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: Date.now(), method: "eth_call", params: [{ to, data }, "latest"] }),
  });
  const json = await response.json();
  if (json.error) throw new Error(json.error.message || "eth_call failed");
  return BigInt(json.result || "0x0");
}

export async function waitForTx(hash: string, rpcUrl = NETWORK.endpoints.evm) {
  for (let i = 0; i < 60; i += 1) {
    const response = await fetch(rpcUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: Date.now(), method: "eth_getTransactionReceipt", params: [hash] }),
    });
    const json = await response.json();
    if (json.result) return json.result;
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }
  throw new Error("transaction receipt timeout");
}

export async function addOrSwitchYnx() {
  if (!window.ethereum) throw new Error("Wallet not found");
  await window.ethereum.request({
    method: "wallet_addEthereumChain",
    params: [
      {
        chainId: NETWORK.evmChainIdHex,
        chainName: NETWORK.name,
        nativeCurrency: { name: "NYXT", symbol: "NYXT", decimals: 18 },
        rpcUrls: [NETWORK.endpoints.evm],
        blockExplorerUrls: [NETWORK.endpoints.explorer],
      },
    ],
  });
}

export async function addOrSwitchEvmChain(params: {
  chainIdHex: string;
  chainName: string;
  nativeCurrency: { name: string; symbol: string; decimals: number };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
}) {
  if (!window.ethereum) throw new Error("Wallet not found");
  try {
    await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: params.chainIdHex }] });
  } catch {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: params.chainIdHex,
          chainName: params.chainName,
          nativeCurrency: params.nativeCurrency,
          rpcUrls: params.rpcUrls,
          blockExplorerUrls: params.blockExplorerUrls || [],
        },
      ],
    });
  }
}

export async function connectAccounts() {
  if (!window.ethereum) throw new Error("Wallet not found");
  return (await window.ethereum.request({ method: "eth_requestAccounts" })) as string[];
}
