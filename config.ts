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
  /**
   * Checkout API URL. No Firebase Blaze needed if you use Vercel:
   * - Deploy this app to Vercel and add api/createCheckout.js (included). Set DODO_API_KEY in Vercel env.
   * - Same-origin: when the app runs on Vercel, we use /api/createCheckout on the same domain.
   * - Or set VITE_CREATE_CHECKOUT_URL to any URL that hosts the checkout API.
   */
  getCreateCheckoutUrl: (): string => {
    if (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_CREATE_CHECKOUT_URL) {
      return (import.meta as any).env.VITE_CREATE_CHECKOUT_URL;
    }
    if (typeof window !== "undefined" && window.location?.origin) {
      return `${window.location.origin}/api/createCheckout`;
    }
    return "https://us-central1-get-reach-21bae.cloudfunctions.net/createCheckout";
  }
};

/** Set to your Google AdSense client ID (e.g. ca-pub-xxxxxxxx) to enable ads. */
export const ADS_CONFIG = {
  clientId: "",
  slotReport: ""
};
