import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { useLocation } from "react-router-dom";
import { smoothScrollTo } from "../utils/smoothScroll";
import styles from "./Header.module.css";

type NavigationItem = {
  label: string;
  href: string;
  icon?: string;
  iconAlt?: string;
  external?: boolean;
};

const navigationItems: NavigationItem[] = [
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

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.classList.toggle("header-menu-open", menuOpen);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("header-menu-open");
    };
  }, [menuOpen]);

  useEffect(() => {
    if (location.pathname !== "/") {
      return;
    }

    const sectionItems = navigationItems.filter((item) =>
      item.href.startsWith("#"),
    );
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (first, second) =>
              second.intersectionRatio - first.intersectionRatio,
          )[0];

        if (visibleSection) {
          setActiveSection(visibleSection.target.id);
        }
      },
      {
        threshold: [0.1, 0.25, 0.5, 0.75, 1],
        rootMargin: "-80px 0px -40% 0px",
      },
    );

    sectionItems.forEach((item) => {
      const section = document.querySelector(item.href);
      if (section) {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, [location.pathname]);

  const currentActiveSection =
    location.pathname !== "/"
      ? location.pathname.startsWith("/projects")
        ? "Projects"
        : null
      : activeSection;

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <header className={styles.mobileHeader} role="banner">
        <Logo />
        <button
          className={`${styles.headerMenuBtn}${menuOpen ? ` ${styles.open}` : ""}`}
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-menu"
          onClick={() => setMenuOpen((isOpen) => !isOpen)}
        >
          <svg
            className={styles.menuSvg}
            viewBox="0 0 32 32"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <line
              className={`${styles.menuLine} ${styles.top}`}
              x1="7"
              y1="11"
              x2="25"
              y2="11"
            />
            <line
              className={`${styles.menuLine} ${styles.bottom}`}
              x1="7"
              y1="21"
              x2="25"
              y2="21"
            />
          </svg>
        </button>
        <nav
          className={`${styles.headerDropdown}${menuOpen ? ` ${styles.open}` : ""}`}
          id="mobile-nav-menu"
          aria-label="Mobile navigation menu"
          aria-hidden={!menuOpen}
        >
          <ul className={styles.headerNavList}>
            {navigationItems.map((item) => (
              <li key={item.label}>
                <NavigationLink
                  item={item}
                  active={
                    currentActiveSection === item.label ||
                    currentActiveSection === item.href.slice(1)
                  }
                  onNavigate={closeMenu}
                  showIcon
                />
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <header className={styles.desktopHeader} role="banner">
        <Logo />
        <nav aria-label="Main navigation">
          <ul className={styles.desktopNavList}>
            {navigationItems.map((item) => (
              <li key={item.label}>
                <NavigationLink
                  item={item}
                  active={
                    currentActiveSection === item.label ||
                    currentActiveSection === item.href.slice(1)
                  }
                />
              </li>
            ))}
          </ul>
        </nav>
      </header>
    </>
  );
}

function Logo() {
  return (
    <a
      className={styles.headerLogoLink}
      href="/"
      aria-label="Lars Torp Pettersen - Home"
    >
      <img
        className={styles.headerLogo}
        src="/icons/echo-logo-3.svg"
        alt="Lars Torp Pettersen logo"
      />
    </a>
  );
}

function NavigationLink({
  item,
  active = false,
  onNavigate,
  showIcon = false,
}: {
  item: NavigationItem;
  active?: boolean;
  onNavigate?: () => void;
  showIcon?: boolean;
}) {
  function handleNavigation(event: MouseEvent<HTMLAnchorElement>) {
    if (!item.href.startsWith("#")) {
      onNavigate?.();
      return;
    }

    const target = document.querySelector(item.href);
    if (!target) {
      onNavigate?.();
      return;
    }

    event.preventDefault();
    const targetY = target.getBoundingClientRect().top + window.scrollY - 80;

    window.history.pushState(null, "", item.href);
    smoothScrollTo(targetY);
    onNavigate?.();
  }

  return (
    <a
      className={active ? styles.active : undefined}
      href={item.href}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noopener noreferrer" : undefined}
      onClick={handleNavigation}
    >
      {showIcon && item.icon ? (
        <>
          <img
            className={styles.dropdownIcon}
            src={item.icon}
            alt={item.iconAlt}
          />
          <span className={styles.dropdownSeparator} aria-hidden="true" />
        </>
      ) : null}
      <span>{item.label}</span>
    </a>
  );
}

export default Header;
