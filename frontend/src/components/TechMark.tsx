import { readableInk } from "@/lib/ink";
import { resolveTechIcon } from "@/lib/tech";

/**
 * A vendor mark, drawn in the vendor's own ink.
 *
 * The mark is decorative: the tool name always sits beside it in text, so the
 * legend never depends on colour or shape alone to be understood.
 */
export function TechMark({
  name,
  size = 18,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const icon = resolveTechIcon(name);
  if (!icon) return null;
  const ink = readableInk(icon.hex);

  return (
    <svg
      viewBox={icon.viewBox}
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {icon.paths.map((d, i) => (
        <path key={i} d={d} fill={ink} />
      ))}
    </svg>
  );
}
