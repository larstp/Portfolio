import { useNavigate } from "react-router-dom";
import type { CSSProperties, KeyboardEvent, MouseEvent } from "react";
import { ButtonLink } from "./Button";
import { type Project, technologies } from "../data/projects";
import styles from "./ProjectCard.module.css";

type TechnologyStyle = CSSProperties & {
  "--technology-color"?: string;
};

type ProjectCardProps = {
  project: Project;
};

function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate();

  function openArticle() {
    navigate(project.articlePath);
  }

  function handleCardClick(event: MouseEvent<HTMLElement>) {
    if ((event.target as HTMLElement).closest("a, button")) {
      return;
    }

    openArticle();
  }

  function handleCardKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    if ((event.target as HTMLElement).closest("a, button")) {
      return;
    }

    event.preventDefault();
    openArticle();
  }

  return (
    <article
      className={styles.card}
      role="link"
      tabIndex={0}
      aria-label={`Read more about ${project.title}`}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
    >
      {project.image ? (
        <img
          className={styles.image}
          src={project.image.src}
          alt={project.image.alt}
          loading="lazy"
        />
      ) : (
        <div
          className={styles.imagePlaceholder}
          aria-label="Project image coming soon"
        >
          <span>{project.title}</span>
        </div>
      )}

      <h3 className={styles.title}>
        <a href={project.articlePath}>{project.title}</a>
      </h3>
      <p className={styles.description}>{project.description}</p>

      <div className={styles.technologies} aria-label="Technologies used">
        {project.technologies.map((technologyId) => {
          const technology = technologies[technologyId];
          const technologyStyle: TechnologyStyle = {
            "--technology-color": technology.color,
          };

          return (
            <span
              className={styles.technology}
              key={technologyId}
              style={technologyStyle}
            >
              {technology.name}
            </span>
          );
        })}
      </div>

      <div className={styles.actions}>
        <ButtonLink
          className={styles.action}
          variant="outline"
          size="sm"
          href={project.links.live}
          external
          onClick={(event) => event.stopPropagation()}
        >
          <img
            src="/icons/streamline-ultimate_space-rocket-earth-bold.svg"
            alt=""
            aria-hidden="true"
          />
          Live link
        </ButtonLink>
        <ButtonLink
          className={styles.action}
          variant="ghost"
          size="sm"
          href={project.links.repository}
          external
          onClick={(event) => event.stopPropagation()}
        >
          <img src="/icons/mdi_github.svg" alt="" aria-hidden="true" />
          Repo
        </ButtonLink>
      </div>
    </article>
  );
}

export default ProjectCard;
