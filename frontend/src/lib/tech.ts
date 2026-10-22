import { TECH_ALIASES, TECH_ICONS, type TechIcon } from "./tech-icons";

/** Lowercase and strip separators so "Next.js", "next js" and "NextJS" agree. */
function normalize(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s._/-]/g, "");
}

const LOOKUP: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const [slug, names] of Object.entries(TECH_ALIASES)) {
    map[normalize(slug)] = slug;
    for (const name of names) map[normalize(name)] = slug;
  }
  return map;
})();

/**
 * Resolves a tool name from Sanity content to its vendor mark.
 * Returns null when the tool has no mark — the name still renders as text.
 */
export function resolveTechIcon(name: string): TechIcon | null {
  const slug = LOOKUP[normalize(name)];
  if (!slug) return null;
  return TECH_ICONS[slug] ?? null;
}
