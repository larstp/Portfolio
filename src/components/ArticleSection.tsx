import styles from "./ArticleSection.module.css";

export type ArticleSectionData = {
  heading: string;
  paragraph: string | string[];
  image?: {
    src: string;
    alt: string;
    caption?: string;
  } | null;
  imagePosition?: "left" | "right" | "below";
};

type ArticleSectionProps = {
  section: ArticleSectionData;
};

function ArticleSection({ section }: ArticleSectionProps) {
  const imagePosition = section.imagePosition ?? "below";
  const className = [
    styles.section,
    imagePosition === "below" ? styles.imageBelow : styles.imageSide,
    imagePosition === "left" ? styles.imageLeft : styles.imageRight,
  ].join(" ");

  return (
    <section className={className}>
      <div className={styles.copy}>
        <h2>{section.heading}</h2>
        {Array.isArray(section.paragraph) ? (
          section.paragraph.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))
        ) : (
          <p>{section.paragraph}</p>
        )}
      </div>
      {section.image ? (
        <figure className={styles.imageBlock}>
          <img src={section.image.src} alt={section.image.alt} />
          {section.image.caption ? (
            <figcaption>{section.image.caption}</figcaption>
          ) : null}
        </figure>
      ) : null}
    </section>
  );
}

export default ArticleSection;
