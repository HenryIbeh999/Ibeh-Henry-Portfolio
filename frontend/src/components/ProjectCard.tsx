import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { stegaClean } from "@sanity/client/stega";
import { ArrowUpRight } from "lucide-react";
import { ImageCarousel, type CarouselImage } from "@/components/ImageCarousel";

export type ProjectSummary = {
  _id: string;
  title?: string;
  slug?: { current?: string } | null;
  techStack?: string[];
  githubUrl?: string;
  dataAdded?: string;
  gallery?: CarouselImage[];
};

export function ProjectCard({
  project,
  index,
}: {
  project: ProjectSummary;
  index: number;
}) {
  const accent = index === 0;
  const slug = stegaClean(project.slug?.current ?? "");
  const tags = project.techStack ?? [];
  const media: CarouselImage[] = project.gallery ?? [];

  if (!slug) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="h-full"
    >
      <article
        className={`group relative flex h-full flex-col overflow-hidden rounded-xl border p-6 transition hover:-translate-y-1 ${
          accent
              ? "border-border bg-surface-2 hover:bg-primary/[0.06]"
              : "border-border bg-surface hover:bg-surface-2"
        }`}
      >
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-20 transition group-hover:opacity-40" />

        <div className="relative flex items-start justify-between">
          <div className="text-xs text-muted-foreground">
            {String(index + 1).padStart(2, "0")}
            {tags.length > 0 && <> · {tags.slice(0, 2).join(", ")}</>}
          </div>
          <ArrowUpRight className="h-5 w-5 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
        </div>

        <div className="relative mt-6 text-2xl font-extrabold tracking-tight">
          {project.title}
        </div>

        {media.length > 0 && (
          <div className="relative mt-4">
            <ImageCarousel images={media} label={project.title ?? slug} />
          </div>
        )}

        {tags.length > 0 && (
          <div className="relative mt-5 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-border bg-background px-2 py-0.5 text-[11px] text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Stretched link: one accessible target for the whole card that sits
            above the media (so the image still navigates) but below the
            carousel's z-20 controls (so dots and arrows stay operable). */}
        <Link
          to="/projects/$projectId"
          params={{ projectId: slug }}
          className="absolute inset-0 z-10 rounded-xl focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <span className="sr-only">{project.title}</span>
        </Link>
      </article>
    </motion.div>
  );
}
