import projectData from "./projects.json";
import technologyData from "./technologies.json";

export const technologies = technologyData.technologies;
export type ProjectTechnology = keyof typeof technologies;

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
};

type ProjectRecord = Omit<Project, "technologies" | "articlePath"> & {
  technologies: string[];
  articlePath?: string;
  featured: boolean;
  status: string;
};

const allProjects = projectData.projects as ProjectRecord[];

export const projects: Project[] = allProjects
  .filter((project) => project.featured && project.status === "active")
  .map((project) => ({
    ...project,
    technologies: project.technologies as ProjectTechnology[],
    articlePath: project.articlePath ?? `/projects/${project.id}`,
  }));
