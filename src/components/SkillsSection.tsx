import { skillCategories } from "../data/skills";
import RevealOnScroll from "./RevealOnScroll";
import SectionHeader from "./SectionHeader";
import styles from "./SkillsSection.module.css";

function SkillsSection() {
  return (
    <section
      className={styles.section}
      id="skills"
      aria-labelledby="skills-heading"
    >
      <div className="content-width">
        <RevealOnScroll>
          <SectionHeader
            eyebrow="Toolkit"
            title="Skills & technologies"
            titleId="skills-heading"
            description="Technologies and tools I work with across programming, design, development, camera, and film software."
          />
        </RevealOnScroll>

        <div className={styles.categories}>
          {skillCategories.map((category, index) => (
            <RevealOnScroll delay={index * 0.08} key={category.id}>
              <section
                className={styles.category}
                aria-labelledby={`${category.id}-heading`}
              >
                <h3 id={`${category.id}-heading`}>{category.title}</h3>
                <div className={styles.grid} role="list">
                  {category.skills.map((skill) => (
                    <div
                      className={styles.skill}
                      role="listitem"
                      data-skill={skill.name}
                      aria-label={skill.name}
                      key={skill.name}
                    >
                      <img
                        src={`/images/skills/${skill.icon}`}
                        alt=""
                        aria-hidden="true"
                      />
                    </div>
                  ))}
                </div>
              </section>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SkillsSection;
