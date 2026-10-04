import { ButtonLink } from "./Button";
import styles from "./Hero.module.css";

function Hero() {
  return (
    <section
      className={styles.heroSection}
      aria-label="Introduction and main title"
    >
      <div className={styles.heroFrame}>
        <div className={styles.titleBlock}>
          <p className={styles.eyebrow}>Lars Torp Pettersen</p>
          <h1 className={styles.title}>
            Front End
            <br />
            Developer
          </h1>
        </div>

        <div className={styles.heroContent}>
          <div className={styles.introduction}>
            <h2>Hi there</h2>
            <p className={styles.bodyCopy}>
              I&apos;m Lars, a Front End Developer, Cinematographer and avid
              astronomy enthusiast living in Oslo.
            </p>
            <p className={styles.bodyCopy}>
              I care deeply about all aspects of design and enjoy creating
              digital experiences that are both efficient and engaging. I&apos;m
              driven by a desire to solve real-world problems through thoughtful
              web development and contribute to design-forward teams.
            </p>
            <p className={styles.bodyCopy}>
              I am actively looking for opportunities to leverage my growing
              skills to solve real-world problems and contribute to a
              design-forward team.
            </p>
            <p className={styles.stellarMessage}>
              Let&apos;s build something stellar together!
              <img
                src="/icons/streamline-ultimate_space-rocket-earth.svg"
                alt=""
                aria-hidden="true"
              />
            </p>
            <div className={styles.actions}>
              <ButtonLink variant="outline" size="lg" href="#contact">
                <img
                  src="/icons/material-symbols_mail-rounded.svg"
                  alt=""
                  aria-hidden="true"
                />
                Contact me
              </ButtonLink>
              <ButtonLink
                variant="ghost"
                size="lg"
                href="https://github.com/larstp"
                external
              >
                <img src="/icons/mdi_github.svg" alt="" aria-hidden="true" />
                GitHub
              </ButtonLink>
            </div>
          </div>
        </div>

        <div className={styles.portraitFrame}>
          <img
            className={styles.portrait}
            src="/images/DSC03075-2.webp"
            alt="Lars Torp Pettersen"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
