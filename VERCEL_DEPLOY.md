# Deploy GetReach on Vercel (free backend, no Blaze)

You can run the full app on **Vercel’s free tier** so the backend works without a Firebase Blaze plan.

## What runs where

- **Vercel**: SPA (React) + serverless APIs (`/api/analyze`, `/api/createCheckout`).
- **Firebase**: Auth and Firestore only (stay on the **free Spark plan**).

## Deploy from Vercel Dashboard (recommended)

1. **Push your code to GitHub** (if you haven’t already).
2. Go to [vercel.com](https://vercel.com) and sign in (GitHub is easiest).
3. Click **Add New… → Project** and **import** your `getreach` repo.
4. Vercel will detect the app. Keep:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Before deploying, open **Environment Variables** and add:
   - **Name:** `GEMINI_API_KEY`  
     **Value:** your key from [Google AI Studio](https://aistudio.google.com/apikey)  
     (required for the analyze API)
   - **Name:** `DODO_API_KEY`  
     **Value:** your Dodo secret key  
     (only if you use the pricing/checkout feature)
6. Click **Deploy**. When the build finishes, your app will be live at `https://your-project.vercel.app`.

## 2. (Optional) Custom domain

In Vercel, add your domain (e.g. `getreach.live`) and point DNS as instructed. The app will use same-origin `/api/analyze` and `/api/createCheckout` automatically.

## 3. Local development

- **Option A – `vercel dev`**  
  Install Vercel CLI and run:
  ```bash
  npx vercel dev
  ```
  The app and API run locally; create a `.env` (or `.env.local`) with `GEMINI_API_KEY` and `DODO_API_KEY` so the API routes can use them.

- **Option B – `npm run dev` only**  
  The app will call `/api/analyze` on the current origin (localhost). To hit your **deployed** Vercel API instead, set in `.env`:
  ```env
  VITE_ANALYZE_API_URL=https://your-app.vercel.app/api/analyze
  VITE_CREATE_CHECKOUT_URL=https://your-app.vercel.app/api/createCheckout
  ```
  Replace `your-app.vercel.app` with your real Vercel URL.

## Summary

- No Firebase Blaze plan needed.
- Backend (Gemini + Dodo) runs as Vercel serverless functions; set `GEMINI_API_KEY` (and `DODO_API_KEY` if needed) in Vercel.
- Firebase is used only for Auth and Firestore on the free plan.
