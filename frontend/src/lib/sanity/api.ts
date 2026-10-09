import { createServerFn } from "@tanstack/react-start";
import {
  GLOBAL_SETTINGS_QUERY,
  PROJECTS_QUERY,
  PROJECT_QUERY,
} from "./queries";

export const getHomeData = createServerFn({ method: "GET" }).handler(async () => {
  const { loadQuery } = await import("./loader.server");

  const [projects, globalSettings] = await Promise.all([
    loadQuery(PROJECTS_QUERY, {}),
    loadQuery(GLOBAL_SETTINGS_QUERY, {}),
  ]);

  return {
    projects: projects.data ?? [],
    globalSettings: globalSettings.data ?? null,
  };
});

export const getProject = createServerFn({ method: "GET" })
  .validator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const { loadQuery } = await import("./loader.server");

    const project = await loadQuery(PROJECT_QUERY, { slug: data.slug });
    return project.data ?? null;
  });
