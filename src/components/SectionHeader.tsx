import styles from "./SectionHeader.module.css";
import DecoderText from "./DecoderText";

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
      <p className={styles.eyebrow}>
        <DecoderText text={eyebrow} startOnView />
      </p>
      <h2 id={titleId}>
        <DecoderText text={title} startOnView />
      </h2>
      <p className={styles.description}>{description}</p>
    </div>
  );
}

export default SectionHeader;
