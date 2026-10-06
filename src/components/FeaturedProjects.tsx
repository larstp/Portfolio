import { projects } from "../data/projects";
import ProjectCard from "./ProjectCard";
import SectionHeader from "./SectionHeader";
import styles from "./FeaturedProjects.module.css";

function FeaturedProjects() {
  return (
    <section
      className={styles.section}
      id="projects"
      aria-labelledby="projects-heading"
    >
      <div className="content-width">
        <SectionHeader
          eyebrow="Selected work"
          title="Featured projects"
          titleId="projects-heading"
          description="A selection of projects that show how I approach design, structure, and front-end development."
        />
        <div className={styles.grid} role="list">
          {projects.map((project) => (
            <ProjectCard project={project} key={project.id} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedProjects;
