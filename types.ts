export enum LoadingStatus {
  IDLE = 'IDLE',
  FETCHING_REPO = 'FETCHING_REPO',
  ANALYZING = 'ANALYZING',
  GENERATING = 'GENERATING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export interface RepoFile {
  path: string;
  content: string;
  size: number;
}

export interface RepoDetails {
  owner: string;
  repo: string;
  branch: string;
}

export interface GenerationResult {
  markdown: string;
  model: string;
  timestamp: number;
}