import type { CSSProperties } from "react";
import { technologies, type ProjectTechnology } from "../data/projects";
import styles from "./TechnologyPills.module.css";

type TechnologyPillsProps = {
  technologiesUsed: ProjectTechnology[];
};

type TechnologyStyle = CSSProperties & {
  "--technology-color"?: string;
};

function TechnologyPills({ technologiesUsed }: TechnologyPillsProps) {
  return (
    <div className={styles.list} aria-label="Technologies used">
      {technologiesUsed.map((technologyId) => {
        const technology = technologies[technologyId];
        const technologyStyle: TechnologyStyle = {
          "--technology-color": technology.color,
        };

        return (
          <span
            className={styles.pill}
            key={technologyId}
            style={technologyStyle}
          >
            {technology.name}
          </span>
        );
      })}
    </div>
  );
}

export default TechnologyPills;
