# Henry.dev Portfolio — Design System

Extraction contract. This file codifies what **already exists** in `src/styles.css` and
`src/routes/index.tsx` — it is not an aspiration. Primitives added after this
extraction (peek rail, image carousel, scrollable timeline) are recorded here too.

## 0. Research Log

Not greenfield — this is an extraction of existing UI, so the greenfield research
lanes (Layer B shortlist, lazyweb, imagen drafts) do not apply.

- Embedded refs: none. Per `design-system-architecture.md` §"For Existing Projects
  (Extraction)", an existing project codifies the implicit system from its own code.
- Source of truth: `src/styles.css` (OKLCH tokens, `@utility` layer, keyframes) and
  `src/routes/index.tsx` (type scale, spacing steps, motion timings, component anatomy).
- Interaction mechanism donor: `cylinder-carousel` from beui.dev, read via
  `https://beui.dev/r/cylinder-carousel/raw`. Donated: soft glide spring, flick
  momentum projection, 1:1 drag tracking, and the reduced-motion contract.
- Flagged inconsistency: the featured `ProjectCard` marked state with
  `border-primary/40`, a coloured accent border on a rounded surface. Swept out in
  this extraction — see §8.

## 1. Atmosphere & Identity

A terminal you keep open. Near-black, monospaced throughout, one phosphor-green
accent that behaves like a *printed* character rather than emitted light.
Density is the point: hairline rules, `01 /` section numbering, and a blinking
block cursor. The signature is **hairline structure** — depth comes from tonal
separation and 1px rules, the way a printed schematic reads, never from blur,
bloom, or glow. Nothing on this page floats; everything sits on a plane.

## 2. Color

Single dark theme, matte. There is no light mode; `--background` is near-black by
design, and no gradient, blur, or glow is permitted anywhere in the UI.

| Role | Token | Value | Usage |
|---|---|---|---|
| Surface/base | `--background` | `oklch(0.13 0.004 260)` | Page ground |
| Surface/raised | `--surface` | `oklch(0.175 0.006 260)` | Cards, panels, timeline body |
| Surface/raised-2 | `--surface-2` | `oklch(0.225 0.008 260)` | Nested wells, portrait ground |
| Surface/inset | `--muted`, `--secondary` | `oklch(0.225 0.008 260)` | Chips, wells |
| Text/primary | `--foreground` | `oklch(0.97 0.005 260)` | Headings, body |
| Text/secondary | `--muted-foreground` | `oklch(0.68 0.01 260)` | Captions, meta, org lines |
| Accent | `--primary` / `--accent` | `oklch(0.86 0.19 135)` | Emphasis, active dot, focus outline |
| Accent/ink | `--primary-foreground` | `oklch(0.13 0.004 260)` | Text on accent fill |
| Border/default | `--border`, `--input` | `oklch(0.30 0.010 260)` | Every card edge and divider |
| Status/error | `--destructive` | `oklch(0.65 0.22 25)` | Destructive only |
| Window chrome | `--win-close` | `oklch(0.62 0.19 25)` | Portrait card traffic dot 1 |
| Window chrome | `--win-minimize` | `oklch(0.75 0.14 82)` | Portrait card traffic dot 2 |
| Window chrome | `--win-maximize` | `oklch(0.68 0.15 145)` | Portrait card traffic dot 3 |

### Rules
- The accent is **flat ink**. It is never blurred, bloomed, or text-shadowed.
  Emphasis comes from the colour itself, not from light emitted around it.
- Accent marks emphasis and the primary action — never decoration.
- **One accent.** The three `--win-*` traffic-light dots on the portrait card are
  the single scoped exception: they are inert 8px window chrome borrowed from the
  macOS motif, desaturated to read matte, and they never encode state or appear
  anywhere else. Do not add a fourth, and do not use them as a general accent.
- **No coloured accent borders on rounded surfaces.** State is carried by surface
  elevation and an ink-alpha wash, never an accent outline.
- **No gradients, box-shadows, text-shadows, or backdrop blur** on any surface.
  The only permitted shadow-class artefact is a focus indicator, and those are
  `outline-*` (a real outline), never `ring-*` (which is box-shadow).
- Extend this table before introducing a colour. There are no raw hex values in the
  codebase and none may be added.

### The two surviving gradients (deliberate)
Both are **masks that prevent a visual defect**, not decoration, and neither
paints a surface:
- `index.tsx` marquee — `mask-image: linear-gradient(...)` fades the ticker's left
  and right edges. Without it the scrolling text is hard-cut mid-glyph.
- Carousel dot ramp — inactive dots use `bg-muted-foreground/40` and
  `hover:/70`. That is the sanctioned ink-alpha state ramp, not a gradient fill.

Every gradient *fill*, orb, blur, glow and box/text shadow has been removed. If a
future change adds one back, it must be justified against this section first.

## 3. Typography

**One family.** `--font-sans` and `--font-mono` both resolve to JetBrains Mono — this
is deliberate and load-bearing for the terminal identity. Max-2-families rule is
satisfied at one.

| Level | Class | Size | Weight | Line height | Tracking | Usage |
|---|---|---|---|---|---|---|
| Display | `text-4xl` → `lg:text-7xl` | 2.25→4.5rem | 800 | 1.05 | `-0.02em` | Hero h1 |
| H2 | `text-2xl` → `md:text-4xl` | 1.5→2.25rem | 800 | 1.25 | `-0.02em` | Section titles |
| Card title | `text-2xl` | 1.5rem | 800 | 1.2 | `-0.02em` | Project / stack card titles |
| Body | `text-sm` → `md:text-base` | 0.875→1rem | 400 | 1.6 | 0 | Bio, descriptions |
| Caption | `text-xs` | 0.75rem | 400–500 | 1.4 | 0 | Meta, tech chips |
| Overline | `text-[11px]` | 0.6875rem | 400–700 | 1.3 | `0.3em` | `01 /` kickers, uppercase |
| Mono micro | `text-[11px]` | 0.6875rem | 400 | 1.6 | 0 | Timeline detail, terminal lines |

### Rules
- Body never below 14px. Micro type is reserved for mono metadata, never prose.
- Uppercase is always paired with wide tracking (`0.3em` for kickers, `widest` for chips).
- Display sizes step by breakpoint; headings that would wrap past 3 lines drop a step.

## 4. Spacing & Layout

Base unit 4px. Tailwind steps are the token layer.

| Intent | Class | Value | Usage |
|---|---|---|---|
| Section gap (major) | `mt-28` | 7rem | Between top-level sections |
| Section gap | `mt-24` | 6rem | Before marquee |
| Block gap | `gap-10` | 2.5rem | Hero two-column split |
| Card grid gap | `gap-5` | 1.25rem | Project card grid |
| Card padding | `p-6` | 1.5rem | Project card, timeline body |
| Card padding (tight) | `p-5` / `p-4` | 1.25/1rem | Stack card, portrait card |
| Cluster gap | `gap-3` | 0.75rem | Buttons, social row |
| Inline gap | `gap-2` | 0.5rem | Icon-to-label, chips |
| Chip row | `gap-1.5` | 0.375rem | Tech chip wrap |

### Grid
- Content width: `max-w-7xl` (80rem), side padding `px-6`.
- Hero split: `md:grid-cols-[1.4fr_1fr]`, `md:items-center`.
- Stat strip: inline `grid-template-columns` from item count, clamped to 4 columns.
- Breakpoints: Tailwind defaults — `sm 640` `md 768` `lg 1024` `xl 1280` `2xl 1536`.
  Named for layout state only, never device.

### Rules
- Intrinsic adaptation is preferred to breakpoints. A `repeat(auto-fit, minmax(min(16rem, 100%), 1fr))`
  track or a `clamp()` is mechanics and stays raw; the *intent* is tokenised.
- Asymmetric spacing is intentional: the hero's `1.4fr/1fr` split buys the headline
  two extra lines of measure before the portrait card starts.
- No horizontal scroll of primary content at 390px.

## 5. Components

Primitives extracted from `src/routes/index.tsx` into `src/components/`.

### Nav
- **Structure**: fixed pill bar, `max-w-3xl`, `top-4`. Mark + wordmark, 5 anchor links
  (hidden below `md`), one accent-filled "Hire me" CTA.
- **States**: default, hover (`hover:bg-surface` + `hover:text-foreground`).
- **Accessibility**: `<header>` landmark; anchors are real `href="#id"`.
- **Motion**: none. It is fixed chrome.
- **Layout**: cluster, wraps by `gap-1`.

### Reveal
- **Structure**: `motion.div` wrapping arbitrary children.
- **Motion**: `opacity 0→1`, `y 20→0`, `duration 0.6`, ease `--ease-expo`.
  Mechanism: the project's existing in-view/mount reveal. Reduced motion: Motion's
  global reduced-motion config collapses the transform, opacity still fades.
- **Layout**: block, `overflow-hidden` so the translate clips cleanly.

### SectionHeader
- **Structure**: kicker over title, hairline rule filling remaining width (`md:block`).
- **Spacing**: `mt-28 mb-8 pb-4`, `border-b border-border`.
- **Layout**: cluster, `items-end justify-between gap-6`.

### Stat
- **Structure**: value over label inside a divided strip.
- **States**: static.

### IconLink
- **Structure**: square bordered icon button wrapping a Lucide icon.
- **States**: default, hover (`hover:border-primary/60 hover:text-primary`) —
  a *hover* border is acceptable state feedback on an icon affordance, not a
  selected/active marker.
- **Accessibility**: `aria-label` carries the network name; icon is decorative.

### StackCard
- **Structure**: 8×8 icon well + uppercase title, then a `›` list.
- **Variants**: `highlight` — icon well filled with accent, raised surface. **Encoded
  by elevation and fill, not by a coloured border.**
- **States**: default, hover (lift `-translate-y-1` + glow).
- **Motion**: `whileInView` y 20→0, `viewport once`.

### ProjectCard
- **Structure**: index · tech meta row, title, media slot, chip row. Whole card is one
  router `<Link>`.
- **Variants**: `accent` (index 0) — elevated `--surface-2` + `shadow-glow`, no
  coloured border.
- **States**: default, hover (`-translate-y-1` + `shadow-glow` + arrow nudge). Hover
  shifts surface tone and adds the glow; it never adds a coloured border. The media
  does not zoom — the carousel track owns its own transform and a second transform
  on the same axis would fight the drag.
- **Accessibility**: one stretched link covering the card (`absolute inset-0 z-10`),
  carrying an `sr-only` title as its accessible name. It sits *above* the media so
  the image still navigates, and *below* the carousel's `z-20` controls so dots and
  arrows stay operable — never nest buttons inside an anchor.
- **Motion**: `whileInView` y 20→0, delay `index * 0.08`, `viewport once margin -50px`.
- **Layout**: grid track. **Scroll owner: none** — the card never scrolls itself; its
  media slot delegates to `ImageCarousel`.

### CardRail
- **Structure**: `<ul>` of `ProjectCard`s.
- **Variants**: three-up grid at `lg`, one-up peek rail below it.
- **Layout**: **reel** below `lg` — `overflow-inline: auto` + `scroll-snap-type:
  inline mandatory`. Each card is full-width (`w-full`), so exactly one card is in
  view at a time and no neighbour peeks; the rail itself is the only cue that more
  exist. Above `lg` the same element becomes a static 3-column grid
  (`repeat(3, minmax(0, 1fr))`) — no horizontal scroll at any width.
- **Accessibility**: the rail is a `tabindex="0"` labelled region with
  `role="group"`; arrow keys and Home/End step between cards via `scrollIntoView`.
  Native touch momentum supplies the swipe.

### ImageCarousel
- **Structure**: `frame` (`aspect-ratio` + `object-fit: cover`) holding a
  `translateX` track of images, plus dot controls. Only rendered when a project has
  ≥2 images; a single image renders as a plain frame.
- **Variants**: single-image (no controls) / multi-image (dots + counter).
- **States**: default, dragging (no transition, 1:1 tracking), settling (spring),
  dot active, dot hover, focus-visible ring.
- **Accessibility**: `role="group"` + `aria-roledescription="carousel"`, each slide
  `aria-hidden` when inactive, dots are real `<button>`s with `aria-label`,
  Left/Right/Home/End keys, `aria-live="polite"` counter.
- **Motion**: mechanism from beui.dev `cylinder-carousel` — drag writes the track
  offset 1:1 in slide units; release projects `velocity * 0.45` clamped to ±6 and
  springs to `round(projected)` with `spring {stiffness:40, damping:20, mass:3}`
  carrying release velocity, so the track never steps. Arrows reuse the same glide.
  Reduced motion: glide dropped, offset set directly.
- **Layout**: `frame`. **Scroll owner: none** — transform-driven, never a scrollbar.

### Timeline
- **Structure**: overline, then a bordered body holding an ordered list of entries
  separated by a hairline rule and a left rail.
- **Variants**: `flow` (≤4 entries, page scrolls) / `scroll` (>4 entries, the body
  becomes its own scroll container).
- **States**: default, entry revealed, edge-faded at both bounds.
- **Accessibility**: `<ol>` preserves chronology; the scroll variant is a
  `tabindex="0"` labelled region so it is keyboard-scrollable; a visible "scroll for
  more" affordance appears only in the scroll variant.
- **Motion**: entries reveal on entry with `whileInView` (`viewport.root` = the scroll
  body, `once`) — `x -8→0` + `opacity`, stagger `i * 0.06`. A scroll-linked rail
  fill is CSS `animation-timeline: scroll(nearest block)`, not a scroll listener.
  Reduced motion: reveals resolve immediately, rail fill becomes static.
- **Layout**: **bounded scroll shell**. `scroll` variant sets `max-block-size` and
  the scroll child carries `min-block-size: 0` so it shrinks instead of pushing the
  page. **Scroll owner: the timeline body — the only nested scroller on the page,
  with the job "expose history beyond the fold".**

## 6. Motion & Interaction

### Timing

| Token | Value | Usage |
|---|---|---|
| `--ease-expo` | `cubic-bezier(0.22, 1, 0.36, 1)` | Every reveal |
| Micro | 150ms | Chip/button hover |
| Standard | 400ms | Card hover lift, carousel dot |
| Emphasis | 500–600ms | Hero entry, project reveal |
| Spring (glide) | `{stiffness:40, damping:20, mass:3}` | Carousel settle |
| Scroll-driven | tied to scroll | Timeline rail fill |

### Rules
- Only `transform`, `opacity`, `filter` animate. No layout properties, ever.
- **Continuous input tracks the pointer 1:1 and settles on a spring.** Never put a
  fixed-duration tween on a gesture surface. The carousel drag writes the offset
  directly; only the release springs.
- **Interruptibility is non-negotiable.** Pointer-down stops any in-flight glide so
  a new grab retargets rather than queues.
- Scroll-triggered reveals use `IntersectionObserver` (via Motion's `viewport`),
  **never a scroll listener**. The rail fill uses CSS scroll-driven animation.
- Every animation has a reduced-motion path that *reduces*: positional and scale
  motion collapses to a cross-fade, fades stay. Under `prefers-reduced-motion` the
  carousel jumps to its target instead of gliding.
- Motion must map to meaning: a reveal says "this arrived", a hover says "this is
  actionable", a rail fill says "there is more history". Nothing loops for
  decoration except the existing caret blink and the availability ping, which both
  signal live status.

## 7. Depth & Surface

**Strategy: tonal-shift + hairline.** Surfaces separate by stepping through the
`--background → --surface → --surface-2` ramp and by carrying a 1px `--border`
edge. **No shadow is used anywhere** — not on cards, not on focus, not on the
portrait. A shadow would imply a light source, and this design has none.

Because there is no cast shadow to do the work, the tonal steps must be wide
enough to read as distinct planes on their own, and elevation is expressed by
*how much* surface tone a thing sits on rather than by how far it is lifted.

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 2px | Dots, chips |
| `--radius-md` | 4px | Small icon wells, inputs |
| `--radius-lg` | 6px | Cards, panels |
| `--radius-xl` | 8px | Portrait card, contact panel |
| `--radius-full` | 9999px | Pills, nav bar, badge |

- Default card edge: `1px solid var(--border)` on `--surface`.
- Focus: `outline: 2px solid var(--ring)` with `outline-offset: 2px`. A real
  outline, so it stays visible on every surface and costs no shadow.
- Hover: an ink-alpha wash (`--foreground` at low alpha) plus a tone step. Never a
  shadow, never an accent border.
- Texture: `grid-bg`, a 40px hairline grid at 4% white — the one piece of depth
  decoration, and it is linework, not light.
- Nested corners are concentric — the portrait's inner image well uses a smaller
  radius inside the card's, never the same value at both depths.

### Rules
- Elevation reads because surface tone and border weight change together. Nothing
  casts a shadow, so nothing may rely on one to look raised.
- Radii are deliberately tight (2–8px). Nothing exceeds 8px except pills.

## 8. Accessibility Constraints & Accepted Debt

### Constraints
- WCAG 2.2 AA target. `--muted-foreground` on `--background` and `--primary` on
  `--background` both clear 4.5:1; `--foreground` on `--surface` clears 7:1.
- Visible `focus-visible` ring on every interactive element, in `--ring` (accent).
  This is the only permitted coloured edge.
- Full keyboard reachability: rail, carousel and timeline scroll regions are all
  focusable and operable; the carousel is arrow-key drivable.
- `prefers-reduced-motion` respected per §6.
- Icon-only controls carry `aria-label`. The blinking caret and ping are decorative
  and hidden from assistive tech.
- No emoji as icons — Lucide only.

### Accepted Debt

| Item | Location | Why accepted | Owner / Exit |
|---|---|---|---|
| `border-primary/40` on the featured project card removed; emphasis now carried by `--surface-2` + `shadow-glow` | `ProjectCard` | Colour accent borders on rounded surfaces are the project's primary AI-slop tell; swept during this extraction | Closed — replaced |
| Carousel has no autoplay | `ImageCarousel` | A project image that moves on its own fights the card's own hover affordance and steals attention from the link | Closed — deliberate, opt-in via prop if ever wanted |
| Timeline scroll variant hides overflow behind edge fades with no visible scrollbar on some platforms | `Timeline` | Native overlay scrollbars are inconsistent; focus + arrow keys provide the access path | Revisit if the timeline grows past ~8 entries |
| Single dark theme; no light mode | Global | The terminal identity is the product; a light variant is not requested | Revisit only on explicit request |
