import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";

const DODO_API_KEY_SECRET = defineSecret("DODO_API_KEY");
const DODO_BASE = "https://live.dodopayments.com";

export const createCheckout = onRequest(
  { cors: true, secrets: [DODO_API_KEY_SECRET] },
  async (req, res) => {
    if (req.method === "OPTIONS") {
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.set("Access-Control-Allow-Headers", "Content-Type");
      return res.status(204).send("");
    }
    res.set("Access-Control-Allow-Origin", "*");

    const apiKey = DODO_API_KEY_SECRET.value();
    if (!apiKey) {
      return res.status(500).json({ error: "DODO_API_KEY not configured. Set it in Firebase Functions config." });
    }

    const productId = req.method === "POST" ? (req.body?.productId || req.query?.productId) : req.query?.productId;
    const email = req.body?.customerEmail ?? req.body?.email ?? req.query?.email ?? "";

    if (!productId) {
      return res.status(400).json({ error: "productId required" });
    }

    try {
      const response = await fetch(`${DODO_BASE}/checkouts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          product_cart: [{ product_id: productId, quantity: 1 }],
          ...(email ? { customer: { email: String(email).trim() } } : {}),
          return_url: req.headers.origin ? `${req.headers.origin}/` : undefined,
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
);
