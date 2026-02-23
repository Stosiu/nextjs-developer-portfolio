'use client';

import {useEffect, useRef} from 'react';
import {getConsent} from '@/lib/consent';
import {loadGA, trackEvent} from '@/lib/analytics';

const SCROLL_MILESTONES = [25, 50, 75, 100];

export function AnalyticsProvider() {
  const firedMilestones = useRef(new Set<number>());

  useEffect(() => {
    if (getConsent() === 'granted') loadGA();

    function onConsentChange(e: Event) {
      if ((e as CustomEvent).detail === 'granted') loadGA();
    }
    window.addEventListener('consent-change', onConsentChange);
    return () => window.removeEventListener('consent-change', onConsentChange);
  }, []);

  useEffect(() => {
    function onScroll() {
      const scrollPct = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100,
      );
      for (const milestone of SCROLL_MILESTONES) {
        if (scrollPct >= milestone && !firedMilestones.current.has(milestone)) {
          firedMilestones.current.add(milestone);
          trackEvent('scroll_depth', {depth: milestone});
        }
      }
    }

    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return null;
}
