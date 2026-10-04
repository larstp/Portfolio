import styles from "./Article.module.css";

function Article() {
  return (
    <main className={styles.page}>
      <article className={styles.article}>
        <p>Project article content will go here.</p>
      </article>
    </main>
  );
}

export default Article;
