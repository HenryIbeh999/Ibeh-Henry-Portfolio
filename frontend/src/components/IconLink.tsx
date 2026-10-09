import type { ReactNode } from "react";

export function IconLink({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-md border border-border transition hover:bg-surface-2 hover:text-primary"
    >
      {children}
    </a>
  );
}