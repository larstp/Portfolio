export type NavigationItem = {
  label: string;
  href: string;
  icon?: string;
  iconAlt?: string;
  external?: boolean;
};

export const navigationItems: NavigationItem[] = [
  {
    label: "Projects",
    href: "#projects",
    icon: "/icons/streamline-ultimate_responsive-design-bold.svg",
    iconAlt: "",
  },
  {
    label: "Skills",
    href: "#skills",
    icon: "/icons/streamline-ultimate_space-rocket-earth.svg",
    iconAlt: "",
  },
  {
    label: "Contact",
    href: "#contact",
    icon: "/icons/material-symbols_mail-rounded.svg",
    iconAlt: "",
  },
  {
    label: "GitHub",
    href: "https://github.com/larstp",
    icon: "/icons/mdi_github.svg",
    iconAlt: "",
    external: true,
  },
];
