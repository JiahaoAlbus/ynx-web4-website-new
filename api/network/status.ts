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
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
    });
  }
}
