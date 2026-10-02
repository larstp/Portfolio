import { useEffect, useState } from "react";

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

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <header className="mobile-header" role="banner">
        <Logo />
        <button
          className={`header-menu-btn${menuOpen ? " open" : ""}`}
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-menu"
          onClick={() => setMenuOpen((isOpen) => !isOpen)}
        >
          <svg
            className="menu-svg"
            viewBox="0 0 32 32"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <line className="menu-line top" x1="7" y1="11" x2="25" y2="11" />
            <line className="menu-line bottom" x1="7" y1="21" x2="25" y2="21" />
          </svg>
        </button>
        <nav
          className={`header-dropdown${menuOpen ? " open" : ""}`}
          id="mobile-nav-menu"
          aria-label="Mobile navigation menu"
          aria-hidden={!menuOpen}
        >
          <ul className="header-nav-list">
            {navigationItems.map((item) => (
              <li key={item.label}>
                <NavigationLink item={item} onNavigate={closeMenu} showIcon />
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <header className="desktop-header" role="banner">
        <Logo />
        <nav className="desktop-nav" aria-label="Main navigation">
          <ul className="desktop-nav-list">
            {navigationItems.map((item) => (
              <li key={item.label}>
                <NavigationLink item={item} />
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
      className="header-logo-link"
      href="/"
      aria-label="Lars Torp Pettersen - Home"
    >
      <img
        className="header-logo"
        src="/icons/echo-logo-3.svg"
        alt="Lars Torp Pettersen logo"
      />
    </a>
  );
}

function NavigationLink({
  item,
  onNavigate,
  showIcon = false,
}: {
  item: NavigationItem;
  onNavigate?: () => void;
  showIcon?: boolean;
}) {
  return (
    <a
      href={item.href}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noopener noreferrer" : undefined}
      onClick={onNavigate}
    >
      {showIcon && item.icon ? (
        <>
          <img className="dropdown-icon" src={item.icon} alt={item.iconAlt} />
          <span className="dropdown-separator" aria-hidden="true" />
        </>
      ) : null}
      {showIcon ? (
        <span className="dropdown-text">{item.label}</span>
      ) : (
        item.label
      )}
    </a>
  );
}

export default Header;
