import { projects } from "../data/projects";
import ProjectCard from "./ProjectCard";
import RevealOnScroll from "./RevealOnScroll";
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
        <RevealOnScroll>
          <SectionHeader
            eyebrow="Selected work"
            title="Featured projects"
            titleId="projects-heading"
            description="A selection of projects that show how I approach design, structure, and front-end development."
          />
        </RevealOnScroll>
        <div className={styles.grid} role="list">
          {projects.map((project, index) => (
            <RevealOnScroll delay={index * 0.08} key={project.id}>
              <ProjectCard project={project} />
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedProjects;
