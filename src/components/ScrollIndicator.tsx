import { useEffect, useState } from "react";

const TOP_THRESHOLD = 100;
const INITIAL_DELAY = 4000;

function ScrollIndicator() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let isAtTop = window.scrollY < TOP_THRESHOLD;
    let scrollTimeout: number | undefined;

    function updateVisibility() {
      const nextIsAtTop = window.scrollY < TOP_THRESHOLD;

      if (nextIsAtTop !== isAtTop) {
        isAtTop = nextIsAtTop;
        setIsVisible(nextIsAtTop);
      }
    }

    function handleScroll() {
      if (scrollTimeout !== undefined) {
        window.clearTimeout(scrollTimeout);
      }

      scrollTimeout = window.setTimeout(updateVisibility, 10);
    }

    const initialTimeout = window.setTimeout(() => {
      if (isAtTop) {
        setIsVisible(true);
      }
    }, INITIAL_DELAY);

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.clearTimeout(initialTimeout);
      if (scrollTimeout !== undefined) {
        window.clearTimeout(scrollTimeout);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`scroll-downs${isVisible ? " show" : ""}`}
      aria-hidden="true"
    >
      <div className="mousey">
        <div className="scroller" />
      </div>
    </div>
  );
}

export default ScrollIndicator;
