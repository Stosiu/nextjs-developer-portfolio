const GA_ID = 'G-LLMJZP3Y2T';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

let loaded = false;

export function loadGA(): void {
  if (loaded || typeof window === 'undefined') return;
  loaded = true;

  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, {anonymize_ip: true});
}

export function trackEvent(name: string, params?: Record<string, string | number>): void {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', name, params);
}
