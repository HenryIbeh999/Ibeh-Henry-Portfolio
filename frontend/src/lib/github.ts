import { createServerFn } from "@tanstack/react-start";

export type GitHubLanguage = {
  name: string;
  hex: string;
  bytes: number;
  /** Share of the total, 0–1. */
  share: number;
};

export type GitHubRepo = {
  name: string;
  language: string | null;
  stars: number;
  url: string;
  pushedAt: string;
  private?: boolean;
};

export type GitHubCommit = {
  sha: string;
  message: string;
  repo: string;
  date: string;
};

export type GitHubActivity = {
  ok: true;
  /** ISO timestamp of the fetch that produced this payload. */
  fetchedAt: string;
  totals: {
    commits: number;
    repos: number;
    stars: number;
    followers: number;
  };
  repos: GitHubRepo[];
  languages: GitHubLanguage[];
  commits: GitHubCommit[];
};

export type GitHubResult = GitHubActivity | { ok: false; error: string };

/**
 * Reads the public GitHub profile. Cached server-side for 15 minutes so the
 * unauthenticated API budget (60 requests an hour per IP) is not the page's
 * problem.
 */
export const getGitHubActivity = createServerFn({ method: "GET" }).handler(
  async (): Promise<GitHubResult> => {
    const { fetchGitHubActivity } = await import("./github.server");
    return fetchGitHubActivity();
  },
);
