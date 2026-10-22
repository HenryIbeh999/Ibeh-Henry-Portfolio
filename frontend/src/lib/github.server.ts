import type { GitHubActivity, GitHubLanguage, GitHubRepo, GitHubResult } from "./github";

const USER = "HenryIbeh999";
const API = "https://api.github.com";
const CACHE_TTL = 30 * 60 * 1000;

/**
 * The public API allows 60 requests an hour for a single IP, and one page load
 * costs about eleven. The process therefore spends a fixed hourly budget and
 * then stops asking: the last good payload is served instead of a fresh one.
 * A stale number beats a broken panel, and the site stops competing with
 * everyone else behind the same address.
 *
 * With a token the ceiling is the API's own, and this budget never binds.
 */
const MAX_REQUESTS_PER_HOUR = process.env.GITHUB_TOKEN ? 2000 : 40;

/** How many repos get an exact byte count from the languages endpoint. */
const MAX_LANGUAGE_REQUESTS = 12;
/** Repos pulled for the commit log. */
const COMMIT_REPOS = 2;
const COMMITS_PER_REPO = 4;

/** GitHub Linguist colours, for the language ledger. */
const LINGUIST_HEX: Record<string, string> = {
  TypeScript: "#3178C6",
  JavaScript: "#F1E05A",
  Python: "#3572A5",
  CSS: "#563D7C",
  SCSS: "#C6538C",
  HTML: "#E34C26",
  Shell: "#89E051",
  Dockerfile: "#384D54",
  Java: "#B07219",
  "C#": "#178600",
  "C++": "#F34B7D",
  C: "#555555",
  Vue: "#41B883",
  Svelte: "#FF3E00",
  Dart: "#00B4AB",
  Go: "#00ADD8",
  Rust: "#DEA584",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Markdown: "#083FA1",
  JSON: "#292929",
  YAML: "#CB171E",
  Astro: "#FF5A03",
  "Jupyter Notebook": "#DA5B0B",
};

/** GitHub counts a few files as "languages". They are not languages. */
const NON_LANGUAGES = new Set(["Profile", "Procfile"]);

type GhUser = {
  login: string;
  name: string | null;
  public_repos: number;
  followers: number;
  created_at: string;
};

type GhRepo = {
  full_name: string;
  name: string;
  fork: boolean;
  private?: boolean;
  language: string | null;
  size: number;
  stargazers_count: number;
  pushed_at: string;
};

type GhCommit = {
  sha: string;
  commit: { message: string; author: { date: string } | null };
};

let cache: { at: number; data: GitHubResult } | null = null;
const requestTimes: number[] = [];

/** Whether this process still has room in its hourly request budget. */
function canSpendRequest(): boolean {
  const cutoff = Date.now() - 60 * 60 * 1000;
  while (requestTimes.length > 0 && requestTimes[0] < cutoff) requestTimes.shift();
  return requestTimes.length < MAX_REQUESTS_PER_HOUR;
}

async function gh<T>(path: string): Promise<T> {
  if (!canSpendRequest()) {
    throw new Error("The GitHub request budget for this hour is spent.");
  }
  requestTimes.push(Date.now());

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "henry-portfolio",
  };
  // Optional. Without it the public API allows 60 requests an hour per IP.
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API}${path}`, { headers });
  if (!res.ok) throw new Error(`GitHub responded ${res.status} for ${path}`);
  return (await res.json()) as T;
}

function languageHex(name: string): string {
  return LINGUIST_HEX[name] ?? "#8B8B93";
}

async function loadActivity(): Promise<GitHubActivity> {
  const [user, repoList] = await Promise.all([
    gh<GhUser>(`/users/${USER}`),
    gh<GhRepo[]>(`/users/${USER}/repos?per_page=100&sort=pushed`),
  ]);

  const own = repoList.filter((r) => !r.fork);
  const stars = own.reduce((n, r) => n + r.stargazers_count, 0);
  const publicRepos = own.filter((r) => !r.private);

  // Total commits authored by the account. The search API is the only public
  // source for a lifetime count.
  let commits = 0;
  try {
    const found = await gh<{ total_count: number }>(`/search/commits?q=author:${USER}&per_page=1`);
    commits = found.total_count;
  } catch {
    commits = 0;
  }

  // Language ledger: all owned repos (public + private) contribute bytes.
  // The repo list and commit feed stay public-only.
  const bytesByLanguage = new Map<string, number>();
  const languageRepos = own
    .slice()
    .sort((a, b) => b.size - a.size)
    .slice(0, MAX_LANGUAGE_REQUESTS);
  await Promise.all(
    languageRepos.map(async (repo) => {
      let breakdown: Record<string, number> | null = null;
      try {
        breakdown = await gh<Record<string, number>>(`/repos/${repo.full_name}/languages`);
      } catch {
        breakdown = null;
      }
      if (!breakdown) {
        // Fall back to the repo's primary language and its reported size.
        if (repo.language) {
          bytesByLanguage.set(
            repo.language,
            (bytesByLanguage.get(repo.language) ?? 0) + repo.size * 1024,
          );
        }
        return;
      }
      for (const [language, size] of Object.entries(breakdown)) {
        bytesByLanguage.set(language, (bytesByLanguage.get(language) ?? 0) + size);
      }
    }),
  );

  // GitHub bills a repository's README as a "Profile" language, and a Heroku
  // Procfile as another. Neither is a language, so neither belongs in the
  // ledger or its share.
  const billable = [...bytesByLanguage.entries()].filter(
    ([name, bytes]) => bytes > 0 && !NON_LANGUAGES.has(name),
  );
  const totalBytes = billable.reduce((sum, [, bytes]) => sum + bytes, 0);
  const languages: GitHubLanguage[] = billable
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, bytes]) => ({
      name,
      hex: languageHex(name),
      bytes,
      share: totalBytes > 0 ? bytes / totalBytes : 0,
    }));

  const repos: GitHubRepo[] = publicRepos
    .slice()
    .sort((a, b) => b.pushed_at.localeCompare(a.pushed_at))
    .slice(0, 6)
    .map((repo) => ({
      name: repo.name,
      language: repo.language,
      stars: repo.stargazers_count,
      url: `https://github.com/${repo.full_name}`,
      pushedAt: repo.pushed_at,
      private: repo.private,
    }));
  // Recent commits from the most recently pushed repositories.
  const recentCommits = (
    await Promise.all(
      publicRepos.slice(0, COMMIT_REPOS).map(async (repo) => {
        try {
          const list = await gh<GhCommit[]>(
            `/repos/${repo.full_name}/commits?per_page=${COMMITS_PER_REPO}`,
          );
          return list.map((c) => ({
            sha: c.sha.slice(0, 7),
            message: c.commit.message.split("\n")[0],
            repo: repo.name,
            date: c.commit.author?.date ?? "",
          }));
        } catch {
          return [];
        }
      }),
    )
  )
    .flat()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6);

  return {
    ok: true,
    fetchedAt: new Date().toISOString(),
    totals: {
      commits,
      repos: user.public_repos,
      stars,
      followers: user.followers,
    },
    languages,
    repos,
    commits: recentCommits,
  };
}

/**
 * Public GitHub activity, cached for 15 minutes.
 * If a refresh fails but a previous payload exists, the stale one is served —
 * the panel shows live numbers, and a slightly stale number beats an error.
 */
export async function fetchGitHubActivity(): Promise<GitHubResult> {
  if (cache && Date.now() - cache.at < CACHE_TTL) return cache.data;

  try {
    const data = await loadActivity();
    cache = { at: Date.now(), data };
    return data;
  } catch (error) {
    if (cache) return cache.data;
    const message = error instanceof Error ? error.message : "The GitHub API could not be reached.";
    return { ok: false, error: message };
  }
}
