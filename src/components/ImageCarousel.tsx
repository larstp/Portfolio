import { useState } from "react";
import type { PointerEvent, TouchEvent } from "react";
import styles from "./ImageCarousel.module.css";

type CarouselImage = {
  src: string;
  alt: string;
  caption?: string;
  fitted?: boolean;
};

type ImageCarouselProps = {
  images: CarouselImage[];
};

function ImageCarousel({ images }: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [hoverSide, setHoverSide] = useState<"previous" | "next" | null>(null);
  const image = images[activeIndex];

  function showSlide(index: number) {
    setActiveIndex((index + images.length) % images.length);
  }

  function handleTouchStart(event: TouchEvent<HTMLElement>) {
    setTouchStart(event.touches[0].clientX);
  }

  function handleTouchEnd(event: TouchEvent<HTMLElement>) {
    if (touchStart === null) return;
    const distance = event.changedTouches[0].clientX - touchStart;
    if (Math.abs(distance) > 40) {
      showSlide(activeIndex + (distance < 0 ? 1 : -1));
    }
    setTouchStart(null);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    setHoverSide(
      event.clientX - bounds.left < bounds.width / 2 ? "previous" : "next",
    );
  }

  return (
    <div
      className={styles.carousel}
      aria-roledescription="carousel"
      aria-label="Project images"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={styles.viewport}
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setHoverSide(null)}
      >
        <button
          className={styles.imageButton}
          type="button"
          aria-label="Show next image"
          onClick={() => showSlide(activeIndex + 1)}
        >
          <img
            className={`${styles.image} ${image.fitted ? styles.fitted : ""}`}
            src={image.src}
            alt={image.alt}
            draggable="false"
          />
        </button>
        <button
          className={`${styles.control} ${styles.previous} ${
            hoverSide === "previous" ? styles.active : ""
          }`}
          type="button"
          aria-label="Previous image"
          onClick={() => showSlide(activeIndex - 1)}
        >
          <svg className={styles.railIcon} viewBox="0 0 20 100">
            <path d="M18 0 V44 L6 50 L18 56 V100" />
          </svg>
        </button>
        <button
          className={`${styles.control} ${styles.next} ${
            hoverSide === "next" ? styles.active : ""
          }`}
          type="button"
          aria-label="Next image"
          onClick={() => showSlide(activeIndex + 1)}
        >
          <svg className={styles.railIcon} viewBox="0 0 20 100">
            <path d="M2 0 V44 L14 50 L2 56 V100" />
          </svg>
        </button>
      </div>
      {image.caption ? (
        <figcaption className={styles.caption}>{image.caption}</figcaption>
      ) : null}
      <div className={styles.dots} aria-label="Choose project image">
        {images.map((slide, index) => (
          <button
            className={`${styles.dot} ${
              index === activeIndex ? styles.active : ""
            }`}
            type="button"
            aria-label={`Show image ${index + 1}`}
            aria-current={index === activeIndex ? "true" : undefined}
            key={`${slide.src}-${index}`}
            onClick={() => showSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default ImageCarousel;
