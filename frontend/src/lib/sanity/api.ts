import { createServerFn } from "@tanstack/react-start";
import {
  GLOBAL_SETTINGS_QUERY,
  PROJECTS_QUERY,
  PROJECT_QUERY,
} from "./queries";

export const getHomeData = createServerFn({ method: "GET" }).handler(async () => {
  const { client } = await import("./loader.server");

  const [projects, globalSettings] = await Promise.all([
    client.fetch(PROJECTS_QUERY),
    client.fetch(GLOBAL_SETTINGS_QUERY),
  ]);

  return {
    projects: projects ?? [],
    globalSettings: globalSettings ?? null,
  };
});

export const getProject = createServerFn({ method: "GET" })
  .validator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const { client } = await import("./loader.server");

    const project = await client.fetch(PROJECT_QUERY, { slug: data.slug });
    return project ?? null;
  });
