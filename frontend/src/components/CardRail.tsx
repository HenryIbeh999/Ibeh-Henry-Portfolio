import { useRef, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { useReducedMotion } from "motion/react";
import { ProjectCard, type ProjectSummary } from "@/components/ProjectCard";

const RAIL_LABEL = "Selected projects";

export function CardRail({ projects }: { projects: ProjectSummary[] }) {
  const railRef = useRef<HTMLUListElement>(null);
  const reduce = useReducedMotion() ?? false;

  const onKeyDown = (event: ReactKeyboardEvent<HTMLUListElement>) => {
    const keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
    if (!keys.includes(event.key)) return;

    const rail = railRef.current;
    if (!rail) return;
    // Above `lg` the rail is a static grid with nothing to scroll; leave the
    // keys to the browser instead of swallowing them.
    if (rail.scrollWidth <= rail.clientWidth + 1) return;

    const items = Array.from(
      rail.querySelectorAll<HTMLElement>("[data-rail-item]"),
    );
    if (items.length === 0) return;

    const current = items.reduce(
      (best, item, i) => {
        const distance = Math.abs(item.offsetLeft - rail.scrollLeft);
        return distance < best.distance ? { distance, index: i } : best;
      },
      { distance: Number.POSITIVE_INFINITY, index: 0 },
    ).index;

    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? items.length - 1
          : event.key === "ArrowRight"
            ? Math.min(current + 1, items.length - 1)
            : Math.max(current - 1, 0);

    event.preventDefault();
    items[next].scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "nearest",
      inline: "start",
    });
  };

  return (
    <ul
      ref={railRef}
      role="group"
      aria-label={RAIL_LABEL}
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:thin] focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0"
    >
      {projects.map((project, i) => (
        <li
          key={project._id}
          data-rail-item
          className="w-full shrink-0 snap-start lg:w-auto lg:shrink"
        >
          <ProjectCard project={project} index={i} />
        </li>
      ))}
    </ul>
  );
}
