import { useEffect, useRef } from "react";
import styles from "./AnimatedBackground.module.css";

function AnimatedBackground() {
  const bottomLayer = useRef<HTMLDivElement>(null);
  const topLayer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let frame: number | null = null;
    let pointerX = 0;
    let pointerY = 0;

    function updateLayers() {
      frame = null;
      const x = (pointerX / window.innerWidth - 0.5) * 2;
      const y = (pointerY / window.innerHeight - 0.5) * 2;

      bottomLayer.current?.style.setProperty(
        "transform",
        `translate(${x * 4}px, ${y * 4}px)`,
      );
      topLayer.current?.style.setProperty(
        "transform",
        `translate(${x * 7}px, ${y * 7}px)`,
      );
    }

    function handlePointerMove(event: PointerEvent) {
      pointerX = event.clientX;
      pointerY = event.clientY;

      if (frame === null) {
        frame = window.requestAnimationFrame(updateLayers);
      }
    }

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  return (
    <div className={styles.container} aria-hidden="true">
      <div className={`${styles.layer} ${styles.bottom}`} ref={bottomLayer} />
      <div className={`${styles.layer} ${styles.top}`} ref={topLayer} />
    </div>
  );
}

export default AnimatedBackground;
