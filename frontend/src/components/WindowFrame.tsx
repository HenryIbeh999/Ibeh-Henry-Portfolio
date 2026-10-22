import type { ReactNode } from "react";

/**
 * The instrument frame used by every panel on the page: a title bar with the
 * three inert window dots and a path, then the panel body on `--surface`.
 *
 * The dots are borrowed chrome from the portrait card in the hero. They are
 * `--win-*` tokens, scoped to panel chrome, and never encode state.
 */
export function WindowFrame({
  path,
  meta,
  children,
}: {
  path: string;
  meta?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-surface-2 px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex items-center gap-1.5" aria-hidden="true">
            <span className="h-2 w-2 rounded-full bg-win-close" />
            <span className="h-2 w-2 rounded-full bg-win-minimize" />
            <span className="h-2 w-2 rounded-full bg-win-maximize" />
          </span>
          <span className="truncate font-mono text-xs text-muted-foreground">{path}</span>
        </div>
        {meta ? (
          <span className="shrink-0 font-mono text-[11px] text-muted-foreground">{meta}</span>
        ) : null}
      </div>
      {children}
    </div>
  );
}
