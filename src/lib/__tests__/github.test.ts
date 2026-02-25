import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {fetchGitHubStats} from '@/lib/github';

type Week = {contributionDays: Array<{contributionCount: number; date: string}>};

function makeWeek(days: Array<{count: number; date: string}>): Week {
  return {
    contributionDays: days.map(d => ({contributionCount: d.count, date: d.date})),
  };
}

function makeMainResponse(overrides?: {
  weeks?: Week[];
  totalContributions?: number;
  contributionYears?: number[];
  totalRepos?: number;
  repoNodes?: Array<{
    isFork: boolean;
    pushedAt: string;
    languages: {edges: Array<{size: number; node: {name: string; color: string}}>};
  }>;
  createdAt?: string;
}) {
  return {
    data: {
      viewer: {
        createdAt: overrides?.createdAt ?? '2015-03-01T00:00:00Z',
        repositories: {totalCount: overrides?.totalRepos ?? 42},
        contributionsCollection: {
          contributionCalendar: {
            totalContributions: overrides?.totalContributions ?? 500,
            weeks: overrides?.weeks ?? [
              makeWeek([
                {count: 3, date: '2025-01-01'},
                {count: 0, date: '2025-01-02'},
              ]),
            ],
          },
          contributionYears: overrides?.contributionYears ?? [2025],
        },
        repositoriesContributedTo: {
          totalCount: 10,
          nodes: overrides?.repoNodes ?? [],
        },
      },
    },
  };
}

function makeYearlyResponse(years: number[], counts: number[]) {
  const viewer: Record<string, {contributionCalendar: {totalContributions: number}}> = {};
  years.forEach((y, i) => {
    viewer[`y${y}`] = {contributionCalendar: {totalContributions: counts[i]}};
  });
  return {data: {viewer}};
}

function makeFetchMock(mainJson: unknown, yearlyJson: unknown) {
  let callCount = 0;
  return vi.fn().mockImplementation(() => {
    callCount++;
    const body = callCount === 1 ? mainJson : yearlyJson;
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(body),
    });
  });
}

beforeEach(() => {
  process.env.GITHUB_TOKEN = 'test-token';
});

afterEach(() => {
  delete process.env.GITHUB_TOKEN;
  vi.restoreAllMocks();
});

describe('fetchGitHubStats', () => {
  it('returns null when GITHUB_TOKEN is not set', async () => {
    delete process.env.GITHUB_TOKEN;
    const result = await fetchGitHubStats();
    expect(result).toBeNull();
  });

  it('returns null when fetch returns a non-ok response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ok: false, json: () => Promise.resolve({})}));
    const result = await fetchGitHubStats();
    expect(result).toBeNull();
  });

  it('returns null when response contains errors', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({errors: [{message: 'Unauthorized'}]}),
      }),
    );
    const result = await fetchGitHubStats();
    expect(result).toBeNull();
  });

  it('returns null when fetch throws', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));
    const result = await fetchGitHubStats();
    expect(result).toBeNull();
  });

  describe('successful response parsing', () => {
    it('maps weeks to contributions grid', async () => {
      const weeks = [
        makeWeek([
          {count: 1, date: '2025-01-01'},
          {count: 2, date: '2025-01-02'},
        ]),
        makeWeek([
          {count: 0, date: '2025-01-08'},
          {count: 5, date: '2025-01-09'},
        ]),
      ];
      vi.stubGlobal('fetch', makeFetchMock(makeMainResponse({weeks}), makeYearlyResponse([2025], [500])));

      const result = await fetchGitHubStats();

      expect(result?.contributions).toEqual([[1, 2], [0, 5]]);
    });

    it('returns totalContributions from the calendar', async () => {
      vi.stubGlobal(
        'fetch',
        makeFetchMock(makeMainResponse({totalContributions: 742}), makeYearlyResponse([2025], [742])),
      );

      const result = await fetchGitHubStats();

      expect(result?.totalContributions).toBe(742);
    });

    it('returns allTimeContributions summed across years', async () => {
      vi.stubGlobal(
        'fetch',
        makeFetchMock(
          makeMainResponse({contributionYears: [2023, 2024, 2025], totalContributions: 300}),
          makeYearlyResponse([2023, 2024, 2025], [200, 400, 300]),
        ),
      );

      const result = await fetchGitHubStats();

      expect(result?.allTimeContributions).toBe(900);
    });

    it('falls back to totalContributions when allTimeContributions is 0', async () => {
      let callCount = 0;
      vi.stubGlobal(
        'fetch',
        vi.fn().mockImplementation(() => {
          callCount++;
          if (callCount === 1) {
            return Promise.resolve({ok: true, json: () => Promise.resolve(makeMainResponse({totalContributions: 300}))});
          }
          return Promise.resolve({ok: false, json: () => Promise.resolve({})});
        }),
      );

      const result = await fetchGitHubStats();

      expect(result?.allTimeContributions).toBe(300);
    });

    it('returns totalRepos as max of owned and contributed repos', async () => {
      const mainJson = {
        data: {
          viewer: {
            ...makeMainResponse().data.viewer,
            repositories: {totalCount: 10},
            repositoriesContributedTo: {
              totalCount: 25,
              nodes: [],
            },
          },
        },
      };
      vi.stubGlobal('fetch', makeFetchMock(mainJson, makeYearlyResponse([2025], [500])));

      const result = await fetchGitHubStats();

      expect(result?.totalRepos).toBe(25);
    });

    it('returns memberSince from viewer.createdAt', async () => {
      vi.stubGlobal(
        'fetch',
        makeFetchMock(
          makeMainResponse({createdAt: '2018-06-15T00:00:00Z'}),
          makeYearlyResponse([2025], [500]),
        ),
      );

      const result = await fetchGitHubStats();

      expect(result?.memberSince).toBe('2018-06-15T00:00:00Z');
    });

    it('identifies the busiest day correctly', async () => {
      const weeks = [
        makeWeek([
          {count: 2, date: '2025-01-01'},
          {count: 10, date: '2025-01-02'},
          {count: 7, date: '2025-01-03'},
        ]),
      ];
      vi.stubGlobal('fetch', makeFetchMock(makeMainResponse({weeks}), makeYearlyResponse([2025], [500])));

      const result = await fetchGitHubStats();

      expect(result?.busiestDay).toEqual({date: '2025-01-02', count: 10});
    });

    describe('currentStreak calculation', () => {
      it('counts consecutive non-zero days from the end', async () => {
        const weeks = [
          makeWeek([
            {count: 0, date: '2025-01-01'},
            {count: 3, date: '2025-01-02'},
            {count: 5, date: '2025-01-03'},
            {count: 1, date: '2025-01-04'},
          ]),
        ];
        vi.stubGlobal('fetch', makeFetchMock(makeMainResponse({weeks}), makeYearlyResponse([2025], [500])));

        const result = await fetchGitHubStats();

        expect(result?.currentStreak).toBe(3);
      });

      it('skips the last day if it has 0 contributions, then counts backwards', async () => {
        const weeks = [
          makeWeek([
            {count: 0, date: '2025-01-01'},
            {count: 4, date: '2025-01-02'},
            {count: 2, date: '2025-01-03'},
            {count: 0, date: '2025-01-04'},
          ]),
        ];
        vi.stubGlobal('fetch', makeFetchMock(makeMainResponse({weeks}), makeYearlyResponse([2025], [500])));

        const result = await fetchGitHubStats();

        expect(result?.currentStreak).toBe(2);
      });

      it('returns 0 when all days are zero', async () => {
        const weeks = [
          makeWeek([
            {count: 0, date: '2025-01-01'},
            {count: 0, date: '2025-01-02'},
          ]),
        ];
        vi.stubGlobal('fetch', makeFetchMock(makeMainResponse({weeks}), makeYearlyResponse([2025], [0])));

        const result = await fetchGitHubStats();

        expect(result?.currentStreak).toBe(0);
      });

      it('stops streak at zero day in the middle', async () => {
        const weeks = [
          makeWeek([
            {count: 5, date: '2025-01-01'},
            {count: 0, date: '2025-01-02'},
            {count: 3, date: '2025-01-03'},
            {count: 2, date: '2025-01-04'},
          ]),
        ];
        vi.stubGlobal('fetch', makeFetchMock(makeMainResponse({weeks}), makeYearlyResponse([2025], [500])));

        const result = await fetchGitHubStats();

        expect(result?.currentStreak).toBe(2);
      });
    });

    describe('languages aggregation', () => {
      it('aggregates languages from non-fork repos pushed within 2 years', async () => {
        const recentDate = new Date();
        recentDate.setMonth(recentDate.getMonth() - 6);
        const repoNodes = [
          {
            isFork: false,
            pushedAt: recentDate.toISOString(),
            languages: {
              edges: [
                {size: 1000, node: {name: 'TypeScript', color: '#3178c6'}},
                {size: 200, node: {name: 'CSS', color: '#563d7c'}},
              ],
            },
          },
        ];
        vi.stubGlobal(
          'fetch',
          makeFetchMock(makeMainResponse({repoNodes}), makeYearlyResponse([2025], [500])),
        );

        const result = await fetchGitHubStats();

        expect(result?.languages).toHaveLength(2);
        expect(result?.languages[0].name).toBe('TypeScript');
        expect(result?.languages[0].percentage).toBe(83.3);
        expect(result?.languages[1].name).toBe('CSS');
      });

      it('excludes forked repos from language aggregation', async () => {
        const recentDate = new Date();
        recentDate.setMonth(recentDate.getMonth() - 1);
        const repoNodes = [
          {
            isFork: true,
            pushedAt: recentDate.toISOString(),
            languages: {
              edges: [{size: 5000, node: {name: 'Java', color: '#b07219'}}],
            },
          },
          {
            isFork: false,
            pushedAt: recentDate.toISOString(),
            languages: {
              edges: [{size: 1000, node: {name: 'TypeScript', color: '#3178c6'}}],
            },
          },
        ];
        vi.stubGlobal(
          'fetch',
          makeFetchMock(makeMainResponse({repoNodes}), makeYearlyResponse([2025], [500])),
        );

        const result = await fetchGitHubStats();

        expect(result?.languages.map(l => l.name)).not.toContain('Java');
        expect(result?.languages.map(l => l.name)).toContain('TypeScript');
      });

      it('excludes repos pushed more than 2 years ago', async () => {
        const oldDate = new Date();
        oldDate.setFullYear(oldDate.getFullYear() - 3);
        const recentDate = new Date();
        recentDate.setMonth(recentDate.getMonth() - 1);
        const repoNodes = [
          {
            isFork: false,
            pushedAt: oldDate.toISOString(),
            languages: {
              edges: [{size: 9000, node: {name: 'Ruby', color: '#701516'}}],
            },
          },
          {
            isFork: false,
            pushedAt: recentDate.toISOString(),
            languages: {
              edges: [{size: 1000, node: {name: 'TypeScript', color: '#3178c6'}}],
            },
          },
        ];
        vi.stubGlobal(
          'fetch',
          makeFetchMock(makeMainResponse({repoNodes}), makeYearlyResponse([2025], [500])),
        );

        const result = await fetchGitHubStats();

        expect(result?.languages.map(l => l.name)).not.toContain('Ruby');
        expect(result?.languages.map(l => l.name)).toContain('TypeScript');
      });

      it('caps languages at 8 entries sorted by size descending', async () => {
        const recentDate = new Date();
        recentDate.setMonth(recentDate.getMonth() - 1);
        const langs = ['TypeScript', 'JavaScript', 'Python', 'Go', 'Rust', 'Ruby', 'Swift', 'Kotlin', 'Dart'];
        const repoNodes = langs.map((name, i) => ({
          isFork: false,
          pushedAt: recentDate.toISOString(),
          languages: {
            edges: [{size: (langs.length - i) * 100, node: {name, color: '#aaaaaa'}}],
          },
        }));
        vi.stubGlobal(
          'fetch',
          makeFetchMock(makeMainResponse({repoNodes}), makeYearlyResponse([2025], [500])),
        );

        const result = await fetchGitHubStats();

        expect(result?.languages).toHaveLength(8);
        expect(result?.languages[0].name).toBe('TypeScript');
        expect(result?.languages.map(l => l.name)).not.toContain('Dart');
      });

      it('uses LANG_COLORS fallback when repo color is missing', async () => {
        const recentDate = new Date();
        recentDate.setMonth(recentDate.getMonth() - 1);
        const repoNodes = [
          {
            isFork: false,
            pushedAt: recentDate.toISOString(),
            languages: {
              edges: [{size: 1000, node: {name: 'TypeScript', color: ''}}],
            },
          },
        ];
        vi.stubGlobal(
          'fetch',
          makeFetchMock(makeMainResponse({repoNodes}), makeYearlyResponse([2025], [500])),
        );

        const result = await fetchGitHubStats();

        expect(result?.languages[0].color).toBe('#3178c6');
      });
    });
  });
});
