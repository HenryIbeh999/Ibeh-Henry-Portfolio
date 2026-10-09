import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type AnimationPlaybackControls,
} from "motion/react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { urlFor } from "@/lib/sanity/image";

export type CarouselImage = Parameters<typeof urlFor>[0] & { alt?: string };

// Mechanism adapted from beui.dev `cylinder-carousel`: a soft spring that
// receives release velocity, so a flick glides past the snap point and settles.
const GLIDE_SPRING = { stiffness: 40, damping: 20, mass: 3 };
// How far a flick keeps rolling: projected slides = release velocity * momentum.
const FLICK_MOMENTUM = 0.45;
const MAX_FLICK_SLIDES = 6;

const frameUrl = (image: CarouselImage) =>
  urlFor(image).width(800).height(450).fit("crop").url();

export function ImageCarousel({
  images,
  label,
}: {
  images: CarouselImage[];
  label: string;
}) {
  const reduce = useReducedMotion() ?? false;
  const count = images.length;
  const multi = count > 1;

  const frameRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const glide = useRef<AnimationPlaybackControls | null>(null);
  const dragging = useRef(false);
  const drag = useRef({
    pointerId: -1,
    startX: 0,
    start: 0,
    lastX: 0,
    lastT: 0,
    prevX: 0,
    prevT: 0,
  });
  const indexRef = useRef(0);
  const [index, setIndex] = useState(0);

  const clamp = useCallback(
    (v: number) => Math.min(Math.max(v, 0), Math.max(count - 1, 0)),
    [count],
  );

  // Percentages resolve against the track's own width, which is `count` frames
  // wide, so `-100 / count` per slide unit is exactly one slide. This must be a
  // template string on `transform` — handing a MotionValue<string> to the numeric
  // `x` prop makes Motion re-wrap it into `translateX(translateX(...))`, which the
  // browser discards, and the track silently never moves.
  const slidePercent = useTransform(
    x,
    (v) => (v * -100) / Math.max(count, 1),
  );
  const transform = useMotionTemplate`translateX(${slidePercent}%)`;

  const stopGlide = useCallback(() => {
    glide.current?.stop();
    glide.current = null;
  }, []);

  const glideTo = useCallback(
    (to: number, velocity = 0) => {
      stopGlide();
      const target = clamp(to);
      if (reduce) {
        x.set(target);
        return;
      }
      glide.current = animate(x, target, {
        type: "spring",
        ...GLIDE_SPRING,
        velocity,
        restDelta: 0.001,
        restSpeed: 0.005,
      });
    },
    [clamp, reduce, stopGlide, x],
  );

  useEffect(() => {
    if (!multi) return;
    return x.on("change", (v) => {
      const next = clamp(Math.round(v));
      if (next !== indexRef.current) {
        indexRef.current = next;
        setIndex(next);
      }
    });
  }, [clamp, multi, x]);

  // A resize changes slide width, so a drag in flight would divide by a stale
  // frame width. Re-seat on the current index when the box changes.
  useEffect(() => {
    if (typeof ResizeObserver === "undefined") return;
    const frame = frameRef.current;
    if (!frame) return;
    const observer = new ResizeObserver(() => x.set(indexRef.current));
    observer.observe(frame);
    return () => observer.disconnect();
  }, [x]);

  const settle = useCallback(
    (velocity: number) => {
      const projected =
        x.get() +
        Math.max(
          -MAX_FLICK_SLIDES,
          Math.min(MAX_FLICK_SLIDES, velocity * FLICK_MOMENTUM),
        );
      glideTo(Math.round(projected), velocity);
    },
    [glideTo, x],
  );

  const slideWidth = () => frameRef.current?.getBoundingClientRect().width ?? 0;

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!multi) return;
    stopGlide();
    dragging.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    const now = performance.now();
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      start: x.get(),
      lastX: event.clientX,
      lastT: now,
      prevX: event.clientX,
      prevT: now,
    };
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current || drag.current.pointerId !== event.pointerId) return;
    const width = slideWidth();
    if (width === 0) return;
    const d = drag.current;
    // 1:1 with the pointer — no tween on a gesture-driven surface.
    x.set(d.start - (event.clientX - d.startX) / width);
    d.prevX = d.lastX;
    d.prevT = d.lastT;
    d.lastX = event.clientX;
    d.lastT = performance.now();
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current || drag.current.pointerId !== event.pointerId) return;
    dragging.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    const d = drag.current;
    const dt = d.lastT - d.prevT;
    const width = slideWidth();
    const vpx = dt > 0 ? (d.lastX - d.prevX) / dt : 0; // px per ms
    settle(width === 0 ? 0 : (-vpx * 1000) / width);
  };

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!multi) return;
    const velocity = x.getVelocity();
    if (event.key === "ArrowRight") {
      event.preventDefault();
      glideTo(indexRef.current + 1, velocity);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      glideTo(indexRef.current - 1, velocity);
    } else if (event.key === "Home") {
      event.preventDefault();
      glideTo(0, velocity);
    } else if (event.key === "End") {
      event.preventDefault();
      glideTo(count - 1, velocity);
    }
  };

  if (count === 0) return null;

  if (!multi) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-lg border border-border">
        <img
          src={frameUrl(images[0])}
          alt={images[0].alt ?? label}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className="relative"
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div
        ref={frameRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="relative aspect-video cursor-grab touch-pan-y overscroll-x-contain select-none overflow-hidden rounded-lg border border-border active:cursor-grabbing focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <motion.div
          className="flex h-full"
          style={{ transform, width: `${count * 100}%` }}
        >
          {images.map((image, i) => (
            // `flex-1`, not `w-full`: a percentage width here resolves against the track,
// which is already `count` frames wide, so `w-full` stretches every image across
// the whole carousel and the frame clips it to one slice.
<div
              key={i}
              className="h-full min-w-0 flex-1"
              aria-hidden={i !== index}
            >
              <img
                src={frameUrl(image)}
                alt={image.alt ?? label}
                loading="lazy"
                draggable={false}
                className="pointer-events-none h-full w-full object-cover"
              />
            </div>
          ))}
        </motion.div>
      </div>

      <button
        type="button"
        onClick={() => glideTo(indexRef.current - 1, x.getVelocity())}
        disabled={index === 0}
        aria-label="Previous image"
        className="absolute left-2 top-1/2 z-20 hidden h-7 w-7 -translate-y-1/2 place-items-center rounded-full border border-border bg-background text-foreground/80 transition hover:bg-surface-2 hover:text-primary focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-30 sm:grid"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => glideTo(indexRef.current + 1, x.getVelocity())}
        disabled={index === count - 1}
        aria-label="Next image"
        className="absolute right-2 top-1/2 z-20 hidden h-7 w-7 -translate-y-1/2 place-items-center rounded-full border border-border bg-background text-foreground/80 transition hover:bg-surface-2 hover:text-primary focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-30 sm:grid"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      <div className="relative z-20 mt-2.5 flex items-center gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => glideTo(i)}
            aria-label={`Show image ${i + 1} of ${count}`}
            aria-current={i === index}
            className={`h-1.5 w-1.5 rounded-full transition-colors focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
              i === index
                ? "scale-125 bg-primary"
                : "bg-muted-foreground/40 hover:bg-muted-foreground/70"
            }`}
          />
        ))}
        <span
          aria-live="polite"
          className="ml-auto font-mono text-[10px] tabular-nums text-muted-foreground"
        >
          {index + 1}/{count}
        </span>
      </div>
    </div>
  );
}
