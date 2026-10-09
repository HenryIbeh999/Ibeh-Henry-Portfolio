import { motion, useReducedMotion, useScroll } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";

export type TimelineEntry = {
  _key?: string;
  year?: string;
  title?: string;
  organization?: string;
};

const OVERLINE = "text-xs uppercase tracking-widest text-primary";
const SCROLL_THRESHOLD = 4;

export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  const scrollable = entries.length > SCROLL_THRESHOLD;
  const scrollBody = useRef<HTMLDivElement | null>(null);
  // Progress indicator, so it tracks real scroll position rather than a reveal.
  // A CSS `animation-timeline: scroll(nearest)` cannot reach this element — it
  // sits beside the scroller, not inside it, so `nearest` would resolve to the page.
  // In flow mode the ref is never attached, and Motion throws on a defined-but-empty
  // container ref, so hand it `undefined` and let it fall back to page tracking.
  const { scrollYProgress } = useScroll({
    container: scrollable ? scrollBody : undefined,
  });
  const reduce = useReducedMotion() ?? false;

  if (entries.length === 0) {
    return <div className={OVERLINE}>timeline</div>;
  }

  // root must be the scroll body: against the page viewport the reveals
  // observe the wrong box once the body becomes its own scroller.
  const viewport = {
    once: true,
    margin: "-40px",
    root: scrollable ? scrollBody : undefined,
  };

  const items = entries.map((entry, i) => (
    <motion.li
      key={entry._key ?? i}
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={viewport}
      transition={{ delay: i * 0.06, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="grid grid-cols-[80px_1fr] gap-4 border-l border-border pl-4"
    >
      <div className="break-words text-sm font-bold text-primary">{entry.year}</div>
      <div className="min-w-0">
        <div className="break-words text-sm font-semibold">{entry.title}</div>
        {entry.organization && (
          <div className="break-words text-xs text-muted-foreground">
            {entry.organization}
          </div>
        )}
      </div>
    </motion.li>
  ));

  if (!scrollable) {
    return (
      <div className="rounded-xl border border-border bg-surface p-6">
        <div className={OVERLINE}>timeline</div>
        <ol className="mt-4 space-y-5">{items}</ol>
      </div>
    );
  }

  return (
    // 20rem holds ~4 rows, so a 5th entry always overflows into a real scroll.
    <div className="grid grid-rows-[auto_minmax(0,1fr)] rounded-xl border border-border bg-surface [max-block-size:20rem]">
      <div className="flex items-center justify-between gap-3 px-6 pt-6 pb-4">
        <div className={OVERLINE}>timeline</div>
        <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-muted-foreground">
          scroll for more
          <ChevronDown className="h-3 w-3" />
        </span>
      </div>

      <div className="relative flex flex-col">
        {/* min-block-size: 0 is mandatory — without it the flex/grid child
            refuses to shrink and the page grows instead of the list scrolling. */}
        <div
          ref={scrollBody}
          tabIndex={0}
          role="group"
          aria-label="Experience history, scrollable"
          className="flex-1 overflow-y-auto [min-block-size:0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <ol className="space-y-5 p-6">{items}</ol>
        </div>

        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-6 top-0 h-px bg-border"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-border"
        />
        <motion.span
          aria-hidden
          className="pointer-events-none absolute left-6 top-6 bottom-6 w-px origin-top bg-primary"
          style={{ scaleY: reduce ? 1 : scrollYProgress }}
        />
      </div>
    </div>
  );
}