import { useEffect, useState } from "react";

export function useActiveSection(
  sectionIds: readonly string[],
  enabled = true,
) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const sectionKey = sectionIds.join("|");

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let frame: number | null = null;

    function updateActiveSection() {
      if (window.scrollY <= 80) {
        setActiveSection(null);
        return;
      }

      const marker = window.scrollY + window.innerHeight * 0.35;
      let nextActiveSection: string | null = null;

      sectionKey.split("|").forEach((sectionId) => {
        const section = document.getElementById(sectionId);
        if (!section) {
          return;
        }

        const sectionTop = section.getBoundingClientRect().top + window.scrollY;
        if (sectionTop <= marker) {
          nextActiveSection = sectionId;
        }
      });

      setActiveSection(nextActiveSection);
    }

    function handleViewportChange() {
      if (frame !== null) {
        return;
      }

      frame = window.requestAnimationFrame(() => {
        frame = null;
        updateActiveSection();
      });
    }

    updateActiveSection();
    window.addEventListener("scroll", handleViewportChange, { passive: true });
    window.addEventListener("resize", handleViewportChange);

    return () => {
      window.removeEventListener("scroll", handleViewportChange);
      window.removeEventListener("resize", handleViewportChange);
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [enabled, sectionKey]);

  return activeSection;
}
