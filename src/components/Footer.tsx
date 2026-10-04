function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer" role="contentinfo">
      <p className="footer-copyright">
        © {currentYear}{" "}
        <a
          className="footer-link"
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
