import { skillCategories } from "../data/skills";
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
        <SectionHeader
          eyebrow="Toolkit"
          title="Skills & technologies"
          titleId="skills-heading"
          description="Technologies and tools I work with across programming, design, development, camera, and film software."
        />

        <div className={styles.categories}>
          {skillCategories.map((category) => (
            <section
              className={styles.category}
              key={category.id}
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
          ))}
        </div>
      </div>
    </section>
  );
}

export default SkillsSection;
