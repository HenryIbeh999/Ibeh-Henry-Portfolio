const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export interface ProjectThumbnail {
  url: string;
  formats?: {
    large?: { url: string };
    medium?: { url: string };
    small?: { url: string };
  };
}

export interface Project {
  id: number;
  documentId: string;
  title: string;
  description: Array<{
    children: Array<{
      text: string;
    }>;
  }>;
  tech_stack: {
    stack: string[];
  };
  github_url: string;
  data_added: string;
  thumbnail: ProjectThumbnail[];
}

export async function fetchProjects(): Promise<Project[]> {
  const res = await fetch(`${API_BASE}/api/projects`);
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
}

export async function fetchProject(id: string): Promise<Project> {
  const res = await fetch(`${API_BASE}/api/projects/${id}`);
  if (!res.ok) throw new Error("Project not found");
  return res.json();
}