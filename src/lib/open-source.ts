import type {OpenSourceProject} from '@/config/open-source';

const RECENT_PRS = 5;

export type MergedPullRequest = {
  title: string;
  url: string;
  mergedAt: string;
};

export type OpenSourceStats = OpenSourceProject & {
  url: string;
  stars: number | null;
  weeklyDownloads: number | null;
  mergedCount: number | null;
  recent: MergedPullRequest[];
};

type SearchResponse = {
  total_count: number;
  items: Array<{title: string; html_url: string; closed_at: string}>;
};

async function getJson<T>(url: string, headers: Record<string, string> = {}): Promise<T | null> {
  try {
    const res = await fetch(url, {headers, next: {revalidate: 86400, tags: ['open-source']}});
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchOpenSourceStats(
  projects: OpenSourceProject[],
  author: string,
): Promise<OpenSourceStats[]> {
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {Accept: 'application/vnd.github+json'};
  if (token) headers.Authorization = `Bearer ${token}`;

  return Promise.all(
    projects.map(async (project) => {
      const query = encodeURIComponent(`repo:${project.repo} author:${author} is:pr is:merged`);
      const [repo, search, downloads] = await Promise.all([
        getJson<{stargazers_count: number}>(`https://api.github.com/repos/${project.repo}`, headers),
        getJson<SearchResponse>(
          `https://api.github.com/search/issues?q=${query}&sort=updated&order=desc&per_page=${RECENT_PRS}`,
          headers,
        ),
        project.npmPackage
          ? getJson<{downloads: number}>(`https://api.npmjs.org/downloads/point/last-week/${project.npmPackage}`)
          : Promise.resolve(null),
      ]);

      return {
        ...project,
        url: `https://github.com/${project.repo}`,
        stars: repo?.stargazers_count ?? null,
        weeklyDownloads: downloads?.downloads ?? null,
        mergedCount: search?.total_count ?? null,
        recent: (search?.items ?? []).map((item) => ({
          title: item.title,
          url: item.html_url,
          mergedAt: item.closed_at,
        })),
      };
    }),
  );
}
