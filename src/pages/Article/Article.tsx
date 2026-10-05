import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, ButtonLink } from "../../components/Button";
import { getProjectById } from "../../data/projects";
import styles from "./Article.module.css";

function Article() {
  const { projectId } = useParams();
  const project = projectId ? getProjectById(projectId) : undefined;
  const [copied, setCopied] = useState(false);

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
      <article className={styles.article}>
        <Link className={styles.backLink} to="/">
          Back to home
        </Link>
        <p className={styles.eyebrow}>Project article</p>
        <h1>{article.title}</h1>
        <div className={styles.articleActions}>
          <Button variant="ghost" size="sm" onClick={copyLink}>
            {copied ? "Link copied" : "Copy link"}
          </Button>
          <ButtonLink
            variant="outline"
            size="sm"
            href={project.links.live}
            external
          >
            Live site
          </ButtonLink>
          <ButtonLink
            variant="ghost"
            size="sm"
            href={`${project.links.repository}/blob/main/README.md`}
            external
          >
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
          <p>{article.role}</p>
          <h2>Process</h2>
          <p>{article.process}</p>
          <h2>Improvement</h2>
          <p>{article.improvement}</p>
          <p>{article.improvementReason}</p>
        </div>
      </article>
    </main>
  );
}

export default Article;
