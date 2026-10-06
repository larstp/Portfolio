import styles from "./SectionHeader.module.css";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  titleId: string;
};

function SectionHeader({
  eyebrow,
  title,
  description,
  titleId,
}: SectionHeaderProps) {
  return (
    <div className={styles.header}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 id={titleId}>{title}</h2>
      <p className={styles.description}>{description}</p>
    </div>
  );
}

export default SectionHeader;
