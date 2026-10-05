export type Skill = {
  name: string;
  icon: string;
};

export type SkillCategory = {
  id: string;
  title: string;
  skills: Skill[];
};

export const skillCategories: SkillCategory[] = [
  {
    id: "languages",
    title: "Programming Languages",
    skills: [
      { name: "JavaScript", icon: "devicon_javascript.svg" },
      { name: "TypeScript", icon: "devicon_typescript.svg" },
    ],
  },
  {
    id: "frontend",
    title: "Frontend",
    skills: [
      { name: "HTML5", icon: "logos_html-5.svg" },
      { name: "CSS3", icon: "logos_css-3.svg" },
      { name: "React", icon: "logos_react.svg" },
    ],
  },
  {
    id: "tools",
    title: "Tools & Development",
    skills: [
      { name: "Git", icon: "devicon_git.svg" },
      { name: "VS Code", icon: "devicon_vscode.svg" },
      { name: "Figma", icon: "devicon_figma.svg" },
      { name: "Docker", icon: "material-icon-theme_docker.svg" },
      { name: "Vite", icon: "skill-icons_vite-dark.svg" },
    ],
  },
  {
    id: "creative",
    title: "Creative Software",
    skills: [
      { name: "Procreate", icon: "logo-procreate-icon.svg" },
      { name: "Photoshop", icon: "devicon_photoshop.svg" },
      { name: "Premiere Pro", icon: "skill-icons_premiere.svg" },
      { name: "Lightroom", icon: "logos_adobe-lightroom.svg" },
      { name: "DaVinci Resolve", icon: "simple-icons_davinciresolve.svg" },
      { name: "Affinity Designer", icon: "simple-icons_affinitypublisher.svg" },
      { name: "Affinity Photo", icon: "simple-icons_affinityphoto.svg" },
      { name: "RED Cinema Cameras", icon: "SHOTonRED_Small_transparent 1.svg" },
      { name: "Sony Cinema Cameras", icon: "sony-pro-logo.svg" },
      { name: "Arri Cinema Cameras", icon: "arri.svg" },
    ],
  },
];
