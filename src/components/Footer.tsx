import styles from "./Footer.module.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.siteFooter} role="contentinfo">
      <p className={styles.footerCopyright}>
        © {currentYear}{" "}
        <a
          className={styles.footerLink}
          href="https://www.edgefilm.no"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit EDGEmedia website (opens in new tab)"
        >
          EDGEmedia
        </a>{" "}
        - Lars Torp Pettersen.
        <br /> All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
