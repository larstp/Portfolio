import { useEffect, useRef, useState } from "react";
import styles from "./DitherVeil.module.css";

type DitherVeilProps = {
  src: string;
  alt: string;
  linger?: number;
  reverse?: boolean;
  className?: string;
};

const bayerMatrix = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

function DitherVeil({
  src,
  alt,
  linger = 1,
  reverse = false,
  className,
}: DitherVeilProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [reducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container || reducedMotion) return;

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });
    const image = new Image();
    const pointer = { x: 0.5, y: 0.5 };
    const targetPointer = { x: 0.5, y: 0.5 };
    const trailPoints: { x: number; y: number; time: number }[] = [];
    let pointerInside = false;
    let animationFrame = 0;

    if (!context) return;
    const element = container;
    const canvasContext = context;

    canvas.setAttribute("aria-hidden", "true");
    canvas.className = styles.canvas;
    element.appendChild(canvas);

    function render() {
      const now = performance.now();
      if (linger > 0) {
        while (
          trailPoints.length > 0 &&
          (now - trailPoints[0].time) / 1000 >= linger
        ) {
          trailPoints.shift();
        }
      } else {
        trailPoints.length = 0;
      }

      const width = Math.max(1, element.clientWidth);
      const height = Math.max(1, element.clientHeight);
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      const pixelWidth = Math.max(1, Math.floor(width * scale));
      const pixelHeight = Math.max(1, Math.floor(height * scale));

      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
      }

      const imageRatio = image.naturalWidth / image.naturalHeight;
      const canvasRatio = width / height;
      const drawWidth = canvasRatio > imageRatio ? width : height * imageRatio;
      const drawHeight = canvasRatio > imageRatio ? width / imageRatio : height;
      const drawX = (width - drawWidth) / 2;
      const drawY = (height - drawHeight) / 2;

      canvasContext.drawImage(
        image,
        drawX * scale,
        drawY * scale,
        drawWidth * scale,
        drawHeight * scale,
      );

      const pixels = canvasContext.getImageData(0, 0, pixelWidth, pixelHeight);
      const revealRadius = 0.07;
      const revealSoftness = 0.3;

      for (let y = 0; y < pixelHeight; y += 1) {
        for (let x = 0; x < pixelWidth; x += 1) {
          const index = (y * pixelWidth + x) * 4;
          const luminance =
            (pixels.data[index] * 0.2126 +
              pixels.data[index + 1] * 0.7152 +
              pixels.data[index + 2] * 0.0722) /
            255;
          const threshold =
            (bayerMatrix[Math.floor(y / 3) % 4][Math.floor(x / 3) % 4] + 0.5) /
            16;
          const imageX = x / pixelWidth;
          const imageY = 1 - y / pixelHeight;
          const revealAt = (pointX: number, pointY: number) => {
            const distance = Math.hypot(
              (imageX - pointX) * (width / height),
              imageY - pointY,
            );
            return Math.max(
              0,
              Math.min(
                1,
                (revealRadius + revealSoftness - distance) / revealSoftness,
              ),
            );
          };
          let reveal = pointerInside ? revealAt(pointer.x, pointer.y) : 0;

          for (const trailPoint of trailPoints) {
            const age = (now - trailPoint.time) / 1000;
            const fade = Math.max(0, 1 - age / linger);
            reveal = Math.max(
              reveal,
              revealAt(trailPoint.x, trailPoint.y) * fade,
            );
          }
          const levels = 4;
          const scaled = luminance * (levels - 1);
          const lower = Math.floor(scaled);
          const upper = Math.min(levels - 1, lower + 1);
          const level = scaled - lower > threshold ? upper : lower;
          const ditheredValue = (level / (levels - 1)) * 255;
          const red = ditheredValue;
          const green = ditheredValue;
          const blue = ditheredValue;
          const ditherAmount = reverse ? reveal : 1 - reveal;

          pixels.data[index] =
            red * ditherAmount + pixels.data[index] * (1 - ditherAmount);
          pixels.data[index + 1] =
            green * ditherAmount + pixels.data[index + 1] * (1 - ditherAmount);
          pixels.data[index + 2] =
            blue * ditherAmount + pixels.data[index + 2] * (1 - ditherAmount);
        }
      }

      canvasContext.putImageData(pixels, 0, 0);
    }

    function animatePointer() {
      pointer.x += (targetPointer.x - pointer.x) * 0.12;
      pointer.y += (targetPointer.y - pointer.y) * 0.12;
      render();

      if (
        Math.abs(targetPointer.x - pointer.x) > 0.001 ||
        Math.abs(targetPointer.y - pointer.y) > 0.001 ||
        trailPoints.length > 0
      ) {
        animationFrame = window.requestAnimationFrame(animatePointer);
      } else {
        animationFrame = 0;
      }
    }

    function handlePointerMove(event: PointerEvent) {
      const bounds = element.getBoundingClientRect();
      const hoverPadding = 40;
      pointerInside =
        event.clientX >= bounds.left - hoverPadding &&
        event.clientX <= bounds.right + hoverPadding &&
        event.clientY >= bounds.top - hoverPadding &&
        event.clientY <= bounds.bottom + hoverPadding;

      if (!pointerInside) {
        if (!animationFrame) {
          animationFrame = window.requestAnimationFrame(animatePointer);
        }
        return;
      }

      targetPointer.x = (event.clientX - bounds.left) / bounds.width;
      targetPointer.y = 1 - (event.clientY - bounds.top) / bounds.height;
      if (linger > 0) {
        trailPoints.push({
          x: targetPointer.x,
          y: targetPointer.y,
          time: performance.now(),
        });
        if (trailPoints.length > 24) {
          trailPoints.shift();
        }
      }

      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(animatePointer);
      }
    }

    image.onload = render;
    image.src = src;

    const resizeObserver = new ResizeObserver(render);
    resizeObserver.observe(element);
    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      image.onload = null;
      canvas.remove();
    };
  }, [linger, reducedMotion, reverse, src]);

  return (
    <div
      ref={containerRef}
      className={`${styles.ditherVeil} ${className ?? ""} ${
        reducedMotion ? styles.reducedMotion : ""
      }`}
      role="img"
      aria-label={alt}
    >
      <img className={styles.fallback} src={src} alt="" aria-hidden="true" />
    </div>
  );
}

export default DitherVeil;
