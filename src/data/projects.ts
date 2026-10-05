import projectData from "./projects.json";
import technologyData from "./technologies.json";

export const technologies = technologyData.technologies;
export type ProjectTechnology = keyof typeof technologies;

export type ProjectArticle = {
  title: string;
  image?: {
    src: string;
    alt: string;
    caption: string;
  } | null;
  description: string;
  improvement: string;
  improvementReason: string;
  role: string;
  process: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  image?: {
    src: string;
    alt: string;
  };
  technologies: ProjectTechnology[];
  links: {
    live: string;
    repository: string;
  };
  articlePath: string;
  article?: ProjectArticle;
};

type ProjectRecord = Omit<Project, "technologies" | "articlePath"> & {
  technologies: string[];
  articlePath?: string;
  featured: boolean;
  status: string;
};

const allProjects = projectData.projects as ProjectRecord[];

function normalizeProject(project: ProjectRecord): Project {
  return {
    ...project,
    technologies: project.technologies as ProjectTechnology[],
    articlePath: project.articlePath ?? `/projects/${project.id}`,
  };
}

export const projects: Project[] = allProjects
  .filter((project) => project.featured && project.status === "active")
  .map(normalizeProject);

export function getProjectById(id: string) {
  const project = allProjects.find((candidate) => candidate.id === id);
  return project ? normalizeProject(project) : undefined;
}
