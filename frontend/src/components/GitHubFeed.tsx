import { ArrowUpRight, Star } from "lucide-react";
import { Stat } from "@/components/Stat";
import { WindowFrame } from "@/components/WindowFrame";
import { readableInk } from "@/lib/ink";
import type { GitHubResult } from "@/lib/github";

const PROFILE_URL = "https://github.com/HenryIbeh999";

function formatStamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(
    date.getUTCDate(),
  )} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`;
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

function formatClock(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`;
}

function formatShare(share: number): string {
  const percent = share * 100;
  if (percent > 0 && percent < 1) return "<1%";
  return `${Math.round(percent)}%`;
}

export function GitHubFeed({ data }: { data: GitHubResult }) {
  if (!data.ok) {
    return (
      <WindowFrame path="~/github/HenryIbeh999">
        <div className="px-5 py-6">
          <p className="max-w-lg text-sm text-muted-foreground">
            GitHub did not answer this time. The public API allows 60 requests an hour for a single
            IP, so a busy or blocked network gets refused outright.
          </p>
          <a
            href={PROFILE_URL}
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-foreground hover:text-primary"
          >
            Read the repositories directly
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </WindowFrame>
    );
  }

  const { totals, languages, repos, commits, fetchedAt } = data;

  return (
    <WindowFrame
      path="~/github/HenryIbeh999"
      meta={
        <>
          synced <span className="hidden sm:inline">{formatDate(fetchedAt)} </span>
          {formatClock(fetchedAt)} UTC
        </>
      }
    >
      {/* live counters */}
      <div className="grid grid-cols-2 gap-px border-b border-border bg-border sm:grid-cols-4">
        <div className="bg-surface">
          <Stat k={String(totals.commits)} v="commits" />
        </div>
        <div className="bg-surface">
          <Stat k={String(totals.repos)} v="repositories" />
        </div>
        <div className="bg-surface">
          <Stat k={String(totals.stars)} v="stars" />
        </div>
        <div className="bg-surface">
          <Stat k={String(totals.followers)} v="followers" />
        </div>
      </div>

      <div className="grid gap-px bg-border lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
        {/* languages */}
        <div className="bg-surface p-5">
          <div className="flex items-center gap-3">
            <h3 className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
              languages
            </h3>
            <span className="h-px flex-1 bg-border" />
          </div>

          <div
            className="mt-4 flex h-2 w-full gap-px overflow-hidden rounded-sm bg-border"
            role="img"
            aria-label={
              languages.length > 0
                ? `Repository bytes by language: ${languages
                    .map((l) => `${l.name} ${formatShare(l.share)}`)
                    .join(", ")}`
                : "No language data yet"
            }
          >
            {languages.map((language) => (
              <span
                key={language.name}
                className="h-full min-w-[2px]"
                style={{
                  flexGrow: Math.max(language.share, 0.02),
                  flexBasis: 0,
                  background: readableInk(language.hex),
                }}
              />
            ))}
          </div>

          <ul className="mt-4 space-y-1.5">
            {languages.map((language) => (
              <li key={language.name} className="flex items-center gap-2.5 text-xs">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-sm"
                  style={{ background: readableInk(language.hex) }}
                  aria-hidden="true"
                />
                <span className="text-muted-foreground">{language.name}</span>
                <span className="ml-auto font-mono text-muted-foreground">
                  {formatShare(language.share)}
                </span>
              </li>
            ))}
            {languages.length === 0 ? (
              <li className="text-xs text-muted-foreground">
                No public repository reports a language yet.
              </li>
            ) : null}
          </ul>

          {/* repositories */}
          <div className="mt-7 flex items-center gap-3">
            <h3 className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
              repositories
            </h3>
            <span className="h-px flex-1 bg-border" />
          </div>

          <ul className="mt-3">
            {repos.map((repo) => (
              <li key={repo.name} className="border-b border-border last:border-b-0">
                <a href={repo.url} className="group flex items-baseline gap-3 py-2">
                  <span className="min-w-0 flex-1 truncate text-xs text-foreground transition-colors group-hover:text-primary">
                    {repo.name}
                  </span>
                  <span className="shrink-0 text-[11px] text-muted-foreground">
                    {repo.language ?? "—"}
                  </span>
                  {repo.stars > 0 ? (
                    <span className="flex shrink-0 items-center gap-1 font-mono text-[11px] text-muted-foreground">
                      <Star className="h-3 w-3 fill-current" aria-hidden="true" />
                      {repo.stars}
                    </span>
                  ) : null}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* commits */}
        <div className="bg-surface">
          <div className="flex items-center gap-3 px-5 pt-5">
            <h3 className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
              recent commits
            </h3>
            <span className="h-px flex-1 bg-border" />
          </div>

          <ul>
            {commits.map((commit) => (
              <li
                key={`${commit.repo}-${commit.sha}`}
                className="border-b border-border px-5 py-3 last:border-b-0"
              >
                <div className="flex items-baseline gap-3">
                  <span className="shrink-0 font-mono text-[11px] text-primary">{commit.sha}</span>
                  <span
                    className="min-w-0 flex-1 truncate text-xs text-foreground"
                    title={commit.message}
                  >
                    {commit.message}
                  </span>
                </div>
                <div className="mt-1 flex items-baseline justify-between gap-3">
                  <span className="truncate text-[11px] text-muted-foreground">{commit.repo}</span>
                  <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                    {formatStamp(commit.date)}
                  </span>
                </div>
              </li>
            ))}
            {commits.length === 0 ? (
              <li className="px-5 py-4 text-xs text-muted-foreground">
                No commits in the public feed right now.
              </li>
            ) : null}
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-3">
        <span className="truncate font-mono text-[11px] text-muted-foreground">
          api.github.com/users/HenryIbeh999
        </span>
        <a
          href={PROFILE_URL}
          className="inline-flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary"
        >
          Open the profile
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </WindowFrame>
  );
}
