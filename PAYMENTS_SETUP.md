# Payments without Firebase Blaze (free)

You can run payments **without upgrading to Firebase’s paid Blaze plan** by using **Vercel** (free tier) for the checkout API.

## What’s in this repo

- **`api/createCheckout.js`** – Vercel serverless function that creates a Dodo checkout session. It reads your secret API key from the environment.
- The app calls **same-origin** `/api/createCheckout` when it’s running on your Vercel URL, so no extra config is needed after deploy.

## Steps (one-time)

### 1. Deploy the app to Vercel

- Push this repo to GitHub (if you haven’t already).
- Go to [vercel.com](https://vercel.com) → **Add New** → **Project** → import your repo.
- Leave **Build Command** as `npm run build` and **Output Directory** as `dist` (or use the defaults; `vercel.json` is set).
- Deploy.

### 2. Add your Dodo API key in Vercel

- In Vercel: open your project → **Settings** → **Environment Variables**.
- Add:
  - **Name:** `DODO_API_KEY`
  - **Value:** your Dodo **secret** API key (from [Dodo Dashboard](https://dashboard.dodopayments.com) → Settings → API keys).
- Save and **redeploy** the project (so the new env var is used).

### 3. Test payment

- Open your deployed app (e.g. `https://your-project.vercel.app`).
- Go to Pricing and click **Start Free Trial** or **Go Annual & Save**.
- The app will call `https://your-project.vercel.app/api/createCheckout` and then open the Dodo checkout (overlay or new tab).

No Firebase Blaze plan and no payment to Firebase for this; only Vercel’s free tier and your Dodo fees.

---

**Local development:** When you run `npm run dev`, there is no `/api/createCheckout` on localhost. To test payments locally, either run `vercel dev` (so the API runs locally too) or set in `.env`: `VITE_CREATE_CHECKOUT_URL=https://your-app.vercel.app/api/createCheckout` (use your real Vercel URL).
