import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';

describe('consent', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getConsent', () => {
    it('returns null when window is undefined', async () => {
      vi.stubGlobal('window', undefined);

      const {getConsent} = await import('@/lib/consent');
      const result = getConsent();

      expect(result).toBeNull();
    });

    it('returns null when localStorage has no value', async () => {
      const getItemMock = vi.fn(() => null);
      vi.stubGlobal('window', {});
      vi.stubGlobal('localStorage', {
        getItem: getItemMock,
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
        key: vi.fn(),
        length: 0,
      });

      const {getConsent} = await import('@/lib/consent');
      const result = getConsent();

      expect(result).toBeNull();
      expect(getItemMock).toHaveBeenCalledWith('stosiu-consent');
    });

    it('returns "granted" when set', async () => {
      const getItemMock = vi.fn(() => 'granted');
      vi.stubGlobal('window', {});
      vi.stubGlobal('localStorage', {
        getItem: getItemMock,
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
        key: vi.fn(),
        length: 1,
      });

      const {getConsent} = await import('@/lib/consent');
      const result = getConsent();

      expect(result).toBe('granted');
    });

    it('returns "denied" when set', async () => {
      const getItemMock = vi.fn(() => 'denied');
      vi.stubGlobal('window', {});
      vi.stubGlobal('localStorage', {
        getItem: getItemMock,
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
        key: vi.fn(),
        length: 1,
      });

      const {getConsent} = await import('@/lib/consent');
      const result = getConsent();

      expect(result).toBe('denied');
    });

    it('returns null for invalid values', async () => {
      const getItemMock = vi.fn(() => 'invalid');
      vi.stubGlobal('window', {});
      vi.stubGlobal('localStorage', {
        getItem: getItemMock,
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
        key: vi.fn(),
        length: 1,
      });

      const {getConsent} = await import('@/lib/consent');
      const result = getConsent();

      expect(result).toBeNull();
    });
  });

  describe('setConsent', () => {
    it('sets value in localStorage', async () => {
      const setItemMock = vi.fn();
      const dispatchEventMock = vi.fn();
      vi.stubGlobal('window', {
        dispatchEvent: dispatchEventMock,
      });
      vi.stubGlobal('localStorage', {
        getItem: vi.fn(),
        setItem: setItemMock,
        removeItem: vi.fn(),
        clear: vi.fn(),
        key: vi.fn(),
        length: 0,
      });

      const {setConsent} = await import('@/lib/consent');
      setConsent('granted');

      expect(setItemMock).toHaveBeenCalledWith('stosiu-consent', 'granted');
    });

    it('dispatches CustomEvent', async () => {
      const dispatchEventMock = vi.fn();
      vi.stubGlobal('window', {
        dispatchEvent: dispatchEventMock,
      });
      vi.stubGlobal('localStorage', {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
        key: vi.fn(),
        length: 0,
      });

      const {setConsent} = await import('@/lib/consent');
      setConsent('denied');

      expect(dispatchEventMock).toHaveBeenCalled();
      const event = dispatchEventMock.mock.calls[0][0];
      expect(event.type).toBe('consent-change');
      expect(event.detail).toBe('denied');
    });
  });
});
