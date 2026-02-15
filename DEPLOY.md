# Deploy GetReach (Firebase + Dodo)

GetReach uses **Firebase** (Hosting, Functions, Auth, Firestore) and **Dodo Payments**.

---

## Prerequisites

- [Node.js](https://nodejs.org/)
- [Firebase CLI](https://firebase.google.com/docs/cli): `npm install -g firebase-tools`

---

## 1. Firebase secrets (required for deploy)

Before deploying, set these secrets so your Cloud Functions can run:

```bash
firebase login
firebase functions:secrets:set GEMINI_API_KEY
# Paste your Gemini API key from aistudio.google.com when prompted

firebase functions:secrets:set DODO_API_KEY
# Paste your Dodo secret key from dashboard.dodopayments.com when prompted
```

---

## 2. Deploy

```bash
npm install
npm run build
cd functions && npm install && cd ..
firebase deploy
```

This deploys:
- **Hosting** – your app (from `dist/`)
- **Functions** – `analyze` and `createCheckout` (serve `/api/analyze` and `/api/createCheckout` via rewrites)
- **Firestore rules** – for reports and feedback

---

## 3. Custom domain (getreach.live)

1. Go to [Firebase Console](https://console.firebase.google.com) → your project → **Hosting**
2. Click **Add custom domain** → enter `getreach.live`
3. Follow the DNS instructions Firebase shows (A records or CNAME)
4. Wait for propagation. Firebase will issue SSL automatically.

---

## 4. Checklist

- [ ] `GEMINI_API_KEY` set via `firebase functions:secrets:set`
- [ ] `DODO_API_KEY` set via `firebase functions:secrets:set`
- [ ] `npm run build` succeeds
- [ ] `firebase deploy` completes
- [ ] App works at `https://your-project.web.app`
- [ ] Custom domain added (optional)

---

## Local development

```bash
npm run dev
```

For localhost, the app calls the deployed Cloud Functions URLs directly (analyze and createCheckout). Make sure you've deployed at least once so the functions exist.
