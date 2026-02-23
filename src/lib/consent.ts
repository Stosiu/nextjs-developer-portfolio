const STORAGE_KEY = 'stosiu-consent';

export type ConsentValue = 'granted' | 'denied';

export function getConsent(): ConsentValue | null {
  if (typeof window === 'undefined') return null;
  const value = localStorage.getItem(STORAGE_KEY);
  if (value === 'granted' || value === 'denied') return value;
  return null;
}

export function setConsent(value: ConsentValue): void {
  localStorage.setItem(STORAGE_KEY, value);
  window.dispatchEvent(new CustomEvent('consent-change', {detail: value}));
}
