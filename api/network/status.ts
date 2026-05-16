import { getNetworkStatus } from "../../src/lib/networkStatus";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const status = await getNetworkStatus();
    res.setHeader("Cache-Control", "s-maxage=10, stale-while-revalidate=20");
    return res.status(200).json(status);
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown_error";
    return res.status(500).json({
      updated_at: new Date().toISOString(),
      chain_id: "ynx_9102-1",
      evm_chain_id: "0x238e",
      source: "live-probe",
      summary: "offline",
      error: message,
    });
  }
}
