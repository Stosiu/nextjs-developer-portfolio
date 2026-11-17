import {describe, it, expect, vi, afterEach} from 'vitest';
import {fetchOpenSourceStats} from '@/lib/open-source';

const project = {repo: 'acme/queue', npmPackage: '@acme/queue', descriptionKey: 'acmeDesc'};

function respond(routes: Record<string, unknown>) {
  return vi.fn().mockImplementation((url: string) => {
    const key = Object.keys(routes).find((k) => url.includes(k));
    const body = key ? routes[key] : undefined;
    return Promise.resolve({ok: body !== undefined, json: () => Promise.resolve(body)});
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.GITHUB_TOKEN;
});

describe('fetchOpenSourceStats', () => {
  it('combines stars, merged PRs and npm downloads', async () => {
    vi.stubGlobal(
      'fetch',
      respond({
        'api.github.com/repos/acme/queue': {stargazers_count: 3533},
        'api.github.com/search/issues': {
          total_count: 95,
          items: [{title: 'fix: retry', html_url: 'https://github.com/acme/queue/pull/1', closed_at: '2026-11-16T10:00:00Z'}],
        },
        'api.npmjs.org': {downloads: 2771446},
      }),
    );

    const [stats] = await fetchOpenSourceStats([project], 'someone');

    expect(stats).toMatchObject({stars: 3533, mergedCount: 95, weeklyDownloads: 2771446, url: 'https://github.com/acme/queue'});
    expect(stats.recent).toEqual([{title: 'fix: retry', url: 'https://github.com/acme/queue/pull/1', mergedAt: '2026-11-16T10:00:00Z'}]);
  });

  it('keeps the other numbers when one source fails', async () => {
    vi.stubGlobal('fetch', respond({'api.github.com/repos/acme/queue': {stargazers_count: 10}}));

    const [stats] = await fetchOpenSourceStats([project], 'someone');

    expect(stats).toMatchObject({stars: 10, mergedCount: null, weeklyDownloads: null, recent: []});
  });

  it('scopes the PR search to the author and sends the token when set', async () => {
    process.env.GITHUB_TOKEN = 't0ken';
    const fetchMock = respond({});
    vi.stubGlobal('fetch', fetchMock);

    await fetchOpenSourceStats([{repo: 'acme/queue', descriptionKey: 'x'}], 'someone');

    const searchCall = fetchMock.mock.calls.find(([url]) => String(url).includes('/search/issues'));
    expect(decodeURIComponent(searchCall![0])).toContain('repo:acme/queue author:someone is:pr is:merged');
    expect(searchCall![1].headers.Authorization).toBe('Bearer t0ken');
    expect(fetchMock.mock.calls.some(([url]) => String(url).includes('npmjs'))).toBe(false);
  });
});
