import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { navigationItems } from "../lib/constants/navigation";
import { useActiveSection } from "../hooks/useActiveSection";
import { smoothScrollTo } from "../utils/smoothScroll";
import styles from "./Header.module.css";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const observedSection = useActiveSection(
    ["projects", "skills", "contact"],
    location.pathname === "/",
  );

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

  const currentActiveSection =
    location.pathname !== "/"
      ? location.pathname.startsWith("/projects")
        ? "Projects"
        : null
      : observedSection;

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
  item: (typeof navigationItems)[number];
  active?: boolean;
  onNavigate?: () => void;
  showIcon?: boolean;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  function handleNavigation(event: MouseEvent<HTMLAnchorElement>) {
    if (!item.href.startsWith("#")) {
      onNavigate?.();
      return;
    }

    const target = document.querySelector(item.href);
    if (!target) {
      if (location.pathname !== "/") {
        event.preventDefault();
        onNavigate?.();
        navigate({ pathname: "/", hash: item.href });

        window.setTimeout(() => {
          const homeTarget = document.querySelector(item.href);
          if (homeTarget) {
            const targetY =
              homeTarget.getBoundingClientRect().top + window.scrollY - 80;
            smoothScrollTo(targetY);
          }
        }, 50);
      } else {
        onNavigate?.();
      }
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
