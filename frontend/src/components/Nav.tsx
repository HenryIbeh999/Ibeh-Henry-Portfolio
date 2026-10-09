const NAV = [
  { label: "Home", href: "#home" },
  { label: "Work", href: "#work" },
  { label: "Stack", href: "#stack" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-4 z-40 mx-auto flex max-w-3xl items-center justify-between rounded-full border border-border bg-background px-3 py-2">
      <a href="#home" className="ml-2 flex items-center gap-2 text-sm font-bold">
        <span>henry.dev</span>
      </a>
      <nav className="hidden items-center gap-1 md:flex">
        {NAV.map((n) => (
          <a
            key={n.href}
            href={n.href}
            className="rounded-full px-3 py-1.5 text-xs text-muted-foreground transition hover:bg-surface-2 hover:text-foreground"
          >
            {n.label}
          </a>
        ))}
      </nav>
      <a
        href="#contact"
        className="rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground transition hover:bg-primary/85 active:translate-y-px"
      >
        Hire me
      </a>
    </header>
  );
}
