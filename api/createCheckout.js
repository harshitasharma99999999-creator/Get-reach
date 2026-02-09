/**
 * Vercel serverless function: create Dodo checkout session.
 * Use this when you don't have Firebase Blaze — no paid plan needed.
 *
 * In Vercel: Project → Settings → Environment Variables
 * Add: DODO_API_KEY = your Dodo secret API key
 *
 * Then set in your app (Vercel env or .env): VITE_CREATE_CHECKOUT_URL = https://your-app.vercel.app/api/createCheckout
 */

const DODO_BASE = "https://live.dodopayments.com";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  const apiKey = process.env.DODO_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "DODO_API_KEY not set. In Vercel: Project → Settings → Environment Variables → add DODO_API_KEY (your Dodo secret key from dashboard.dodopayments.com) → Save → Redeploy.",
    });
  }

  const productId =
    req.method === "POST"
      ? req.body?.productId || req.query?.productId
      : req.query?.productId;
  const email =
    req.body?.customerEmail ?? req.body?.email ?? req.query?.email ?? "";

  if (!productId) {
    return res.status(400).json({ error: "productId required" });
  }

  try {
    const origin = req.headers.origin || req.headers.referer?.replace(/\/$/, "") || "";
    const response = await fetch(`${DODO_BASE}/checkouts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        product_cart: [{ product_id: productId, quantity: 1 }],
        ...(email ? { customer: { email: String(email).trim() } } : {}),
        ...(origin ? { return_url: `${origin}/` } : {}),
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Dodo API error", response.status, data);
      return res.status(response.status).json(data);
    }
    if (!data.checkout_url) {
      return res.status(502).json({ error: "No checkout_url in response" });
    }
    return res.status(200).json({ checkoutUrl: data.checkout_url });
  } catch (e) {
    console.error("createCheckout error", e);
    return res.status(500).json({ error: "Failed to create checkout session" });
  }
}
