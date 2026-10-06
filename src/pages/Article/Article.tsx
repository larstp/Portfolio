import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { MouseEvent } from "react";
import { Button, ButtonLink } from "../../components/Button";
import { getProjectById } from "../../data/projects";
import { smoothScrollTo } from "../../utils/smoothScroll";
import styles from "./Article.module.css";

function Article() {
  const { projectId } = useParams();
  const project = projectId ? getProjectById(projectId) : undefined;
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  function handleBackToProjects(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    navigate({ pathname: "/", hash: "#projects" });

    window.setTimeout(() => {
      const projectsSection = document.getElementById("projects");
      if (projectsSection) {
        const targetY =
          projectsSection.getBoundingClientRect().top + window.scrollY - 80;
        smoothScrollTo(targetY);
      }
    }, 50);
  }

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  if (!project || !project.article) {
    return (
      <main className={styles.page}>
        <article className={styles.article}>
          <h1>Project not found</h1>
          <Link className={styles.backLink} to="/">
            Back to home
          </Link>
        </article>
      </main>
    );
  }

  const { article } = project;

  return (
    <main className={styles.page}>
      {article.logo ? (
        <div
          className={styles.logoBackground}
          style={{ backgroundImage: `url("${article.logo.src}")` }}
          aria-hidden="true"
        />
      ) : null}
      <article className={styles.article}>
        <Link
          className={styles.backLink}
          to="/#projects"
          onClick={handleBackToProjects}
        >
          <span>Back to home</span>
          <span className={styles.backIcon} aria-hidden="true">
            <img
              className={styles.backIconOutline}
              src="/icons/flowbite_arrow-right-alt-outline.svg"
              alt=""
            />
            <img
              className={styles.backIconSolid}
              src="/icons/flowbite_arrow-right-alt-solid.svg"
              alt=""
            />
          </span>
        </Link>
        <p className={styles.eyebrow}>Project article</p>
        <h1>{article.title}</h1>
        <h3 className={styles.subheading}>{article.subheading}</h3>
        <div className={styles.articleActions}>
          <Button
            className={styles.articleAction}
            variant="ghost"
            size="sm"
            onClick={copyLink}
          >
            <img
              src="/icons/material-symbols_link-rounded.svg"
              alt=""
              aria-hidden="true"
            />
            {copied ? "Link copied" : "Copy link"}
          </Button>
          <ButtonLink
            variant="outline"
            size="sm"
            className={styles.articleAction}
            href={project.links.live}
            external
          >
            <img
              src="/icons/streamline-ultimate_space-rocket-earth-bold.svg"
              alt=""
              aria-hidden="true"
            />
            Live site
          </ButtonLink>
          <ButtonLink
            variant="ghost"
            size="sm"
            className={styles.articleAction}
            href={`${project.links.repository}/blob/main/README.md`}
            external
          >
            <img src="/icons/mdi_github.svg" alt="" aria-hidden="true" />
            README.md
          </ButtonLink>
        </div>

        {article.image ? (
          <figure className={styles.heroImage}>
            <img src={article.image.src} alt={article.image.alt} />
            <figcaption>{article.image.caption}</figcaption>
          </figure>
        ) : (
          <div className={styles.imagePlaceholder}>
            Article image coming soon
          </div>
        )}

        <div className={styles.content}>
          <p>{article.description}</p>
          <h2>My role</h2>
          <ul className={styles.roleList}>
            {article.roles.map((role) => (
              <li key={role}>{role}</li>
            ))}
          </ul>
          <h2>Process</h2>
          <p>{article.process}</p>
          <h2>Improvement</h2>
          <p>{article.improvement}</p>
          <p>{article.improvementReason}</p>
          {article.pullRequest ? (
            <ButtonLink
              className={styles.improvementAction}
              variant="ghost"
              size="sm"
              href={article.pullRequest}
              external
            >
              <img src="/icons/mdi_github.svg" alt="" aria-hidden="true" />
              Check out the pull request
            </ButtonLink>
          ) : null}
        </div>
      </article>
    </main>
  );
}

export default Article;
