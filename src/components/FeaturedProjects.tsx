import { projects } from "../data/projects";
import ProjectCard from "./ProjectCard";
import styles from "./FeaturedProjects.module.css";

function FeaturedProjects() {
  return (
    <section
      className={styles.section}
      id="projects"
      aria-labelledby="projects-heading"
    >
      <div className="content-width">
        <div className={styles.introduction}>
          <p className={styles.eyebrow}>Selected work</p>
          <h2 id="projects-heading">Featured projects</h2>
          <p>
            A selection of projects that show how I approach design, structure,
            and front-end development.
          </p>
        </div>
        <div className={styles.grid} role="list">
          {projects.map((project) => (
            <div role="listitem" key={project.id}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedProjects;
