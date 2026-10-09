import { createFileRoute, Link } from "@tanstack/react-router";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { stegaClean } from "@sanity/client/stega";
import { urlFor } from "@/lib/sanity/image";
import { ArrowLeft, ArrowUpRight, Calendar, Github } from "lucide-react";
import { getProject } from "@/lib/sanity/api";

type ProjectDetail = {
  _id: string;
  title?: string;
  description?: PortableTextBlock[];
  techStack?: string[];
  githubUrl?: string;
  dataAdded?: string;
  gallery?: Parameters<typeof urlFor>[0][];
};

export const Route = createFileRoute("/projects/$projectId")({
  component: ProjectDetailRoute,
  loader: async ({ params }) => {
    const project = await getProject({
      data: { slug: stegaClean(params.projectId) },
    });
    return { project: (project ?? null) as ProjectDetail | null };
  },
});

function ProjectDetailRoute() {
  const { project } = Route.useLoaderData();

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <h1 className="text-4xl font-extrabold text-foreground">404</h1>
        <p className="mt-2 text-sm text-muted-foreground">Project not found.</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back home
        </Link>
      </div>
    );
  }

  const tags = project.techStack ?? [];

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed inset-x-0 top-0 z-40 mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="group inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition hover:bg-surface-2 hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
          Back
        </Link>
      </header>

      <main className="mx-auto max-w-5xl px-6 pb-24 pt-28">
        {project.gallery?.[0] && (
          <div className="relative overflow-hidden rounded-2xl border border-border bg-surface">
            <div className="relative aspect-video">
              <img
                src={urlFor(project.gallery[0]).width(1200).height(675).fit("crop").url()}
                alt={project.title ?? ""}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}

        <div className="mt-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
                {project.title}
              </h1>
              {project.dataAdded && (
                <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{project.dataAdded}</span>
                </div>
              )}
            </div>

            {project.githubUrl && (
              <a
                href={stegaClean(project.githubUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-medium text-foreground transition hover:bg-surface-2 hover:text-primary"
              >
                <Github className="h-4 w-4" />
                View on GitHub
                <ArrowUpRight className="h-4 w-4 transition group-hover:rotate-45" />
              </a>
            )}
          </div>

          {project.description && project.description.length > 0 && (
            <div className="mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground">
              <PortableText value={project.description} />
            </div>
          )}

          {tags.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xs uppercase tracking-[0.3em] text-primary">Tech Stack</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {tags.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md border border-primary/30 bg-primary/[0.04] px-3 py-1.5 text-sm font-medium text-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-16 border-t border-border pt-8">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
            Back to all projects
          </Link>
        </div>
      </main>
    </div>
  );
}
