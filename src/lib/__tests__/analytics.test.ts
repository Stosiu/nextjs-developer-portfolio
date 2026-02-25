import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';

describe('analytics', () => {
  let envBackup: string | undefined;

  beforeEach(() => {
    vi.resetModules();
    envBackup = process.env.NEXT_PUBLIC_GA_ID;
  });

  afterEach(() => {
    vi.resetModules();
    if (envBackup === undefined) {
      delete process.env.NEXT_PUBLIC_GA_ID;
    } else {
      process.env.NEXT_PUBLIC_GA_ID = envBackup;
    }
  });

  describe('isAnalyticsEnabled', () => {
    it('returns false when NEXT_PUBLIC_GA_ID is not set', async () => {
      delete process.env.NEXT_PUBLIC_GA_ID;

      const {isAnalyticsEnabled} = await import('@/lib/analytics');

      expect(isAnalyticsEnabled()).toBe(false);
    });

    it('returns true when NEXT_PUBLIC_GA_ID is set', async () => {
      process.env.NEXT_PUBLIC_GA_ID = 'G-123456789';

      const {isAnalyticsEnabled} = await import('@/lib/analytics');

      expect(isAnalyticsEnabled()).toBe(true);
    });
  });

  describe('trackEvent', () => {
    it('does nothing when window.gtag is not defined', async () => {
      vi.stubGlobal('window', {
        gtag: undefined,
      });

      const {trackEvent} = await import('@/lib/analytics');

      expect(() => trackEvent('test_event')).not.toThrow();
    });

    it('calls window.gtag with correct args when defined', async () => {
      const gtagMock = vi.fn();
      vi.stubGlobal('window', {
        gtag: gtagMock,
        dataLayer: [],
      });

      const {trackEvent} = await import('@/lib/analytics');

      trackEvent('test_event', {value: 100});

      expect(gtagMock).toHaveBeenCalledWith('event', 'test_event', {value: 100});
    });

    it('calls window.gtag without params when not provided', async () => {
      const gtagMock = vi.fn();
      vi.stubGlobal('window', {
        gtag: gtagMock,
        dataLayer: [],
      });

      const {trackEvent} = await import('@/lib/analytics');

      trackEvent('test_event');

      expect(gtagMock).toHaveBeenCalledWith('event', 'test_event', undefined);
    });

    it('does nothing when window is undefined', async () => {
      vi.stubGlobal('window', undefined);

      const {trackEvent} = await import('@/lib/analytics');

      expect(() => trackEvent('test_event')).not.toThrow();
    });
  });
});
