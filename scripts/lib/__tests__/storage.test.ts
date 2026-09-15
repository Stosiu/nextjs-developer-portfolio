import {afterEach, describe, expect, it, vi} from 'vitest';
import {createStorage} from '../storage';

const ENV = {
  R2_ACCOUNT_ID: 'account',
  R2_ACCESS_KEY_ID: 'key',
  R2_SECRET_ACCESS_KEY: 'secret',
  R2_BUCKET: 'bucket',
};

function respondWith(status: number, body = '') {
  vi.stubGlobal('fetch', vi.fn(async () => new Response(status === 404 ? null : body, {status})));
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('createStorage', () => {
  it('throws when R2 config is missing', () => {
    expect(() => createStorage({...ENV, R2_BUCKET: ''})).toThrow(/R2_BUCKET/);
  });

  it('treats a missing object as empty', async () => {
    respondWith(404);
    await expect(createStorage(ENV).fetchJson('stats/daily-history.json')).resolves.toBeNull();
  });

  it('throws on a failed read so stored history is never overwritten with partial data', async () => {
    respondWith(403);
    await expect(createStorage(ENV).fetchJson('stats/daily-history.json')).rejects.toThrow('403');
  });

  it('parses a stored object', async () => {
    respondWith(200, JSON.stringify([{period: '2026-09-01'}]));
    await expect(createStorage(ENV).fetchJson('stats/daily-history.json')).resolves.toEqual([{period: '2026-09-01'}]);
  });

  it('throws when an upload is rejected', async () => {
    respondWith(403);
    await expect(createStorage(ENV).uploadJson('stats/ai.json', {})).rejects.toThrow('403');
  });
});
