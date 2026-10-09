import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import {
  Github,
  Linkedin,
  Twitter,
  ArrowUpRight,
  Terminal,
  Cpu,
  Gamepad2,
  Code2,
  Mail,
  MapPin,
  Wrench,
} from "lucide-react";
import { getHomeData } from "@/lib/sanity/api";
import { CardRail } from "@/components/CardRail";
import type { ProjectSummary } from "@/components/ProjectCard";
import { IconLink } from "@/components/IconLink";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { StackCard } from "@/components/StackCard";
import { Stat } from "@/components/Stat";
import { Timeline, type TimelineEntry } from "@/components/Timeline";

type HeroStat = { _key?: string; label?: string; value?: string };
type StackCategory = {
  _key?: string;
  title?: string;
  icon?: string;
  highlight?: boolean;
  items?: string[];
};
type Hero = {
  name?: string;
  bio?: string;
  tagline?: PortableTextBlock[];
  stats?: HeroStat[];
};
type GlobalSettings = {
  _id?: string;
  siteName?: string;
  siteDescription?: string;
  hero?: Hero;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
  stackCategories?: StackCategory[];
  experience?: TimelineEntry[];
  contact?: {
    heading?: string;
    subtext?: string;
    email?: string;
    githubUrl?: string;
  };
};

export const Route = createFileRoute("/")({
  component: Index,
  loader: async () => {
    const data = await getHomeData();
    return {
      projects: (data.projects ?? []) as ProjectSummary[],
      globalSettings: (data.globalSettings ?? null) as GlobalSettings | null,
    };
  },
});

const STACK_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Cpu,
  Code2,
  Gamepad2,
  Wrench,
};

const FALLBACK_STACK = [
  "Python", "JavaScript", "C#", "FASTAPI", "React", "Flask",
  "MySQL", "TypeScript", "Git"
];

const taglineComponents = {
  block: ({ children }: { children?: ReactNode }) => (
    <span className="inline">{children}</span>
  ),
  marks: {
    strong: ({ children }: { children?: ReactNode }) => (
      <span className="text-primary">{children}</span>
    ),
    em: ({ children }: { children?: ReactNode }) => (
      <span className="italic">{children}</span>
    ),
  },
} satisfies PortableTextComponents;

function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}

function splitTrailingSentence(text: string): [string, string | null] {
  const idx = text.lastIndexOf("? ");
  if (idx === -1) return [text, null];
  return [text.slice(0, idx + 1), text.slice(idx + 2)];
}

function Index() {
  const { projects, globalSettings } = Route.useLoaderData();
  const mounted = useMounted();
  const { scrollYProgress } = useScroll();
  const barWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const heroRef = useRef<HTMLDivElement>(null);

  const hero = globalSettings?.hero;
  const social = globalSettings?.socialLinks;
  const contact = globalSettings?.contact;
  const stackCategories = globalSettings?.stackCategories ?? [];
  const experience = globalSettings?.experience ?? [];
  const stats = hero?.stats ?? [];

  const marquee = stackCategories.flatMap((cat) => cat.items ?? []);
  const marqueeItems = marquee.length > 0 ? marquee : FALLBACK_STACK;

  const headingParts = contact?.heading
    ? splitTrailingSentence(contact.heading)
    : null;

  return (
    <div id="home" className="relative min-h-screen">
      {/* scroll progress */}
      <motion.div
        style={{ width: barWidth }}
        className="fixed left-0 top-0 z-50 h-0.5 bg-primary"
      />

      <Nav />

      <main className="mx-auto max-w-7xl px-6 pb-24 pt-28 md:pt-32">
        {/* HERO */}
        <section ref={heroRef} className="relative">
          <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" />
          <div className="relative grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-5 inline-flex items-start gap-2 rounded-full border border-primary/40 bg-primary/5 px-3 py-2 text-xs text-primary sm:items-center"
              >
                <span className="relative mt-0.5 flex h-2 w-2 sm:mt-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                <span>
                  <span className="block sm:inline">available for internships</span>
                  <span className="hidden sm:inline"> · </span>
                  <span className="block sm:inline">freelance jobs</span>
                </span>
              </motion.div>

              <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
                <Reveal delay={0.05}>
                  <span className="text-foreground">
                    I&apos;m {hero?.name ?? "Ibeh Henry"}.
                  </span>
                </Reveal>
                {hero?.tagline && hero.tagline.length > 0 ? (
                  <Reveal delay={0.15}>
                    <span className="text-muted-foreground">
                      <PortableText value={hero.tagline} components={taglineComponents} />
                    </span>
                  </Reveal>
                ) : (
                  <Reveal delay={0.15}>
                    <span className="text-muted-foreground">
                      I build{" "}
                      <span className="text-primary">systems</span>
                      <span className="text-muted-foreground">,</span>{" "}
                      <span className="text-muted-foreground">apps &amp; </span>
                      <span className="text-primary">games</span>
                      <span className="text-muted-foreground">.</span>
                    </span>
                  </Reveal>
                )}
              </h1>

              {hero?.bio && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45, duration: 0.5 }}
                  className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base"
                >
                  {hero.bio}
                </motion.p>
              )}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.4 }}
                className="mt-8 flex flex-wrap items-center gap-3"
              >
                <a
                  href="#contact"
                  className="group inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:-translate-y-px active:translate-y-0 hover:translate-y-[-1px]"
                >
                  Contact me
                  <ArrowUpRight className="h-4 w-4 transition group-hover:rotate-45" />
                </a>
                <a
                  href="#work"
                  className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-medium text-foreground/90 transition hover:bg-surface-2 hover:text-primary"
                >
                  See selected work
                </a>
                <div className="ml-1 flex items-center gap-3 text-muted-foreground">
                  {social?.github && (
                    <IconLink href={social.github} label="GitHub"><Github className="h-4 w-4" /></IconLink>
                  )}
                  {social?.linkedin && (
                    <IconLink href={social.linkedin} label="LinkedIn"><Linkedin className="h-4 w-4" /></IconLink>
                  )}
                  {social?.twitter && (
                    <IconLink href={social.twitter} label="Twitter"><Twitter className="h-4 w-4" /></IconLink>
                  )}
                </div>
              </motion.div>

              {/* stats */}
              {stats.length > 0 && (
                <div
                  className="mt-10 grid max-w-lg divide-x divide-border rounded-lg border border-border bg-surface"
                  style={{ gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, minmax(0, 1fr))` }}
                >
                  {stats.map((stat, i) => (
                    <Stat key={stat._key ?? i} k={stat.value ?? ""} v={(stat.label ?? "").toLowerCase()} />
                  ))}
                </div>
              )}
            </div>

            {/* portrait card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="relative mx-auto w-full max-w-sm"
            >
              <div className="relative rounded-2xl border border-border bg-surface p-4">
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-win-close" />
                      <span className="h-2 w-2 rounded-full bg-win-minimize" />
                      <span className="h-2 w-2 rounded-full bg-win-maximize" />
                  </span>
                  <span>~/ibeh — zsh</span>
                </div>
                <div className="mt-3 aspect-square overflow-hidden rounded-lg border border-border bg-surface-2">
                  <div className="grid h-full place-items-center text-center">
                    <div>
                      <div className="text-7xl font-extrabold text-primary">IH</div>
                      <div className="mt-2 text-xs tracking-[0.3em] text-muted-foreground">IBEH · HENRY</div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-1 font-mono text-[11px] leading-relaxed text-muted-foreground">
                  <div><span className="text-primary">$</span> whoami</div>
                  <div className="pl-2 text-foreground">ibeh_henry</div>
                  <div><span className="text-primary">$</span> cat role.txt</div>
                  <div className="pl-2 text-foreground">
                    software engineer<span className="animate-blink text-primary">▍</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <MapPin className="h-3 w-3" /> earth · remote-friendly
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-3 -right-3 -z-10 h-full w-full rounded-2xl border border-primary/30" />
            </motion.div>
          </div>
        </section>

        {/* MARQUEE */}
        <section className="mt-24 border-y border-border py-5">
          <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="flex shrink-0 animate-marquee gap-10 pr-10 text-sm uppercase tracking-widest text-muted-foreground">
              {[...marqueeItems, ...marqueeItems].map((s, i) => (
                <span key={i} className="flex items-center gap-10">
                  <span className="hover:text-primary">{s}</span>
                  <span className="text-primary">◆</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* WORK */}
        <SectionHeader id="work" kicker="01 / selected work" title="Things I've built" />
        <CardRail projects={projects} />

        {/* STACK */}
        <SectionHeader id="stack" kicker="02 / the toolbox" title="What I reach for" />
        <section
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${Math.min(stackCategories.length || 1, 3)}, minmax(0, 1fr))` }}
        >
          {stackCategories.map((cat, i) => {
            const Icon = STACK_ICONS[cat.icon ?? ""] ?? Wrench;
            return (
              <StackCard
                key={cat._key ?? i}
                icon={<Icon className="h-5 w-5" />}
                title={cat.title ?? ""}
                items={cat.items ?? []}
                highlight={cat.highlight}
              />
            );
          })}
        </section>

        {/* ABOUT + EXPERIENCE */}
        <SectionHeader id="about" kicker="03 / EXP" title="My journey so far" />
        <Timeline entries={experience} />

        {/* CONTACT */}
        <section id="contact" className="mt-28">
          <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-surface p-8 md:p-14">
            <div className="absolute inset-0 grid-bg opacity-30" />
            {/* Registration marks replace the old blurred glow orb — sharp linework,
                same depth cue, no light. */}
            <span aria-hidden className="pointer-events-none absolute left-5 top-5 h-3 w-3 border-l border-t border-primary/50" />
            <span aria-hidden className="pointer-events-none absolute right-5 top-5 h-3 w-3 border-r border-t border-primary/50" />
            <span aria-hidden className="pointer-events-none absolute bottom-5 left-5 h-3 w-3 border-b border-l border-primary/50" />
            <span aria-hidden className="pointer-events-none absolute bottom-5 right-5 h-3 w-3 border-b border-r border-primary/50" />
            <div className="relative">
              <div className="text-xs uppercase tracking-[0.3em] text-primary">04 / say hi</div>
              <h2 className="mt-3 max-w-2xl text-3xl font-extrabold leading-tight md:text-5xl">
                {headingParts ? (
                  <>
                    {headingParts[0]}{" "}
                    {headingParts[1] && (
                      <span className="text-primary">{headingParts[1]}</span>
                    )}
                  </>
                ) : (
                  <>
                    Got a problem worth solving?{" "}
                    <span className="text-primary">Let&apos;s talk.</span>
                  </>
                )}
              </h2>
              {contact?.subtext && (
                <p className="mt-4 max-w-xl text-sm text-muted-foreground">
                  {contact.subtext}
                </p>
              )}
              <div className="mt-8 flex flex-wrap gap-3">
                {contact?.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="group inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
                  >
                    <Mail className="h-4 w-4" /> {contact.email}
                    <ArrowUpRight className="h-4 w-4 transition group-hover:rotate-45" />
                  </a>
                )}
                {contact?.githubUrl && (
                  <a
                    href={contact.githubUrl}
                    className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 text-sm hover:bg-surface-2 hover:text-primary"
                  >
                    <Github className="h-4 w-4" /> View GitHub
                  </a>
                )}
              </div>
            </div>
          </div>
          <footer className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row">
            <div>© {mounted ? new Date().getFullYear() : "2026"} Ibeh Henry</div>
            <div className="flex items-center gap-2">
              <Terminal className="h-3.5 w-3.5 text-primary" /> Working on something...probably
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}
