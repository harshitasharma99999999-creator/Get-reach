/** Production app URL (custom domain). Used for canonical, sharing, and any absolute URLs. */
export const APP_URL = "https://getreach.live";

/**
 * Configuration for Firebase and Dodo Payments
 */
export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDeKl6OWVjUH_VDhCQzRvWwm7nLHGRa5RE",
  authDomain: "get-reach-21bae.firebaseapp.com",
  projectId: "get-reach-21bae",
  storageBucket: "get-reach-21bae.firebasestorage.app",
  messagingSenderId: "447867994960",
  appId: "1:447867994960:web:a5decd3db2ee3c54a4a255",
  measurementId: "G-6D24M52X9F"
};

/** Dodo Dashboard: Settings for live payments. Set publicKey in Dodo Dashboard (Settings) for live payments. */
export const DODO_CONFIG = {
  publicKey: "bus_0NXtr3I0VPy5EZLZ347T9",
  productIdMonthly: "pdt_0NXzOvcubuh5CW0JIWQew",
  productIdYearly: "pdt_0NXzP1ahdtlPPOXGWzHyH",
  /** Checkout API URL. Same-origin when deployed (Vercel); localhost uses env override or same-origin with `vercel dev`. */
  getCreateCheckoutUrl: (): string => {
    if (typeof window !== "undefined" && window.location?.origin) {
      const envUrl = import.meta.env.VITE_CREATE_CHECKOUT_URL;
      if (envUrl && typeof envUrl === "string") return envUrl;
      return `${window.location.origin}/api/createCheckout`;
    }
    return "/api/createCheckout";
  }
};
