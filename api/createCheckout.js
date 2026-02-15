const DODO_BASE = "https://live.dodopayments.com";

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

/**
 * Vercel serverless API: create Dodo checkout session.
 * Env: DODO_API_KEY (required for payments).
 * No Blaze plan needed; deploy to Vercel free tier.
 */
export default async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(204).end();

  const apiKey = process.env.DODO_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "DODO_API_KEY not configured. Set it in Vercel project Environment Variables." });

  const body = req.body || {};
  const productId = req.method === "POST" ? (body.productId || req.query?.productId) : req.query?.productId;
  const email = body.customerEmail ?? body.email ?? req.query?.email ?? "";
  if (!productId) return res.status(400).json({ error: "productId required" });

  try {
    const origin = req.headers?.origin || (req.headers?.referer || "").replace(/\/$/, "") || "";
    const response = await fetch(`${DODO_BASE}/checkouts`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      body: JSON.stringify({
        product_cart: [{ product_id: productId, quantity: 1 }],
        ...(email ? { customer: { email: String(email).trim() } } : {}),
        ...(origin ? { return_url: `${origin}/` } : {}),
      }),
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);
    if (!data.checkout_url) return res.status(502).json({ error: "No checkout_url in response" });
    return res.status(200).json({ checkoutUrl: data.checkout_url });
  } catch {
    return res.status(500).json({ error: "Failed to create checkout session" });
  }
}
