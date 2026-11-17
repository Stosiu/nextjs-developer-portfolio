export type OpenSourceProject = {
  repo: string;
  npmPackage?: string;
  descriptionKey: string;
};

export const openSourceProjects: OpenSourceProject[] = [
  {
    repo: 'felixmosh/bull-board',
    npmPackage: '@bull-board/api',
    descriptionKey: 'bullBoardDesc',
  },
];
