import { DODO_CONFIG } from '../config';

const DODO_OVERLAY_SCRIPT = 'https://cdn.jsdelivr.net/npm/dodopayments-checkout@latest/dist/index.js';

declare global {
  interface Window {
    DodoPaymentsCheckout?: {
      DodoPayments: {
        Initialize: (opts: { mode: string; displayType?: string; onEvent: (e: any) => void }) => void;
        Checkout: { open: (opts: { checkoutUrl: string }) => void };
      };
    };
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Script load failed'));
    document.head.appendChild(script);
  });
}

const POLL_INTERVAL_MS = 300;
const POLL_TIMEOUT_MS = 5000;

function waitForDodoPayments(): Promise<NonNullable<Window['DodoPaymentsCheckout']>['DodoPayments']> {
  return new Promise((resolve) => {
    const start = Date.now();
    const tick = () => {
      const Dodo = window.DodoPaymentsCheckout?.DodoPayments;
      if (Dodo) {
        resolve(Dodo);
        return;
      }
      if (Date.now() - start >= POLL_TIMEOUT_MS) {
        resolve(undefined as any);
        return;
      }
      setTimeout(tick, POLL_INTERVAL_MS);
    };
    tick();
  });
}

export const triggerCheckout = async (productId: string, userEmail?: string): Promise<void> => {
  if (!DODO_CONFIG.publicKey?.trim()) {
    alert('Payment is not configured. Add your Dodo public key in the app.');
    return;
  }

  const url = DODO_CONFIG.getCreateCheckoutUrl();

  let checkoutUrl: string | null = null;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, customerEmail: userEmail || '' })
    });
    let data: { checkoutUrl?: string; error?: string } = {};
    try {
      data = await res.json();
    } catch {
      alert('Server error. Please check your connection and try again.');
      return;
    }
    if (!res.ok) {
      const msg = data?.error || 'Could not start checkout.';
      const isSetup = msg.includes('DODO_API_KEY') || res.status === 500;
      const setupSteps = isSetup
        ? '\n\nTo enable payments:\n1. Get your Dodo secret API key from dashboard.dodopayments.com (Settings → API keys).\n2. In Vercel: Project Settings → Environment Variables → add DODO_API_KEY.\n3. Redeploy your Vercel project.'
        : '';
      alert(msg + setupSteps);
      return;
    }
    checkoutUrl = data.checkoutUrl || null;
    if (!checkoutUrl) {
      alert('Invalid response from checkout. Try again.');
      return;
    }

    const openCheckoutFallback = (reason: string | null) => {
      if (checkoutUrl) {
        window.open(checkoutUrl!, '_blank', 'noopener');
        alert(reason ? `${reason} Opening the checkout page in a new tab — complete your purchase there.` : 'Opening checkout in a new tab.');
      } else {
        alert(reason || 'Something went wrong. Check your connection and try again.');
      }
    };

    try {
      await loadScript(DODO_OVERLAY_SCRIPT);
      const Dodo = await waitForDodoPayments();
      if (!Dodo) {
        openCheckoutFallback('Payment overlay did not load.');
        return;
      }

      Dodo.Initialize({
        mode: 'live',
        displayType: 'overlay',
        onEvent: (e: any) => {
          if (e?.event_type === 'checkout.closed' || e?.event_type === 'checkout.redirect') {
            // Optional: track or refresh
          }
          if (e?.event_type === 'checkout.error') {
            // Error handled by overlay
          }
        }
      });

      Dodo.Checkout.open({ checkoutUrl });
    } catch {
      openCheckoutFallback('Could not open payment overlay.');
    }
  } catch {
    if (checkoutUrl) {
      window.open(checkoutUrl, '_blank', 'noopener');
      alert('Opening checkout in a new tab — complete your purchase there.');
    } else {
      alert(
        'Something went wrong. Check your connection and try again.\n\n' +
        'If you run this site: add DODO_API_KEY in Vercel Environment Variables, then redeploy.'
      );
    }
  }
};
