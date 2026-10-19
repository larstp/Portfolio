import { useEffect, useRef, useState } from "react";
import styles from "./DecoderText.module.css";

type DecoderTextProps = {
  text: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  startOnView?: boolean;
  className?: string;
};

const symbols =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789";

function randomSymbol() {
  return symbols[Math.floor(Math.random() * symbols.length)];
}

function DecoderText({
  text,
  delay = 0,
  stagger = 35,
  duration = 220,
  startOnView = false,
  className,
}: DecoderTextProps) {
  const decoderRef = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(!startOnView);
  const [characters, setCharacters] = useState(() =>
    Array.from(text, (character) => (character === " " ? " " : randomSymbol())),
  );
  const [decoded, setDecoded] = useState(() =>
    Array.from(text, (character) => character === " "),
  );
  const [visible, setVisible] = useState(() =>
    Array.from(text, (character) => character === " "),
  );

  useEffect(() => {
    if (!startOnView) return;

    const element = decoderRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setStarted(true);
        observer.disconnect();
      },
      { threshold: 0.2 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [startOnView]);

  useEffect(() => {
    if (!started) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    const intervals: ReturnType<typeof setInterval>[] = [];

    Array.from(text).forEach((character, index) => {
      if (character === " ") return;

      const startTimer = setTimeout(
        () => {
          setVisible((current) => {
            const next = [...current];
            next[index] = true;
            return next;
          });

          const scrambleInterval = setInterval(() => {
            setCharacters((current) => {
              const next = [...current];
              next[index] = randomSymbol();
              return next;
            });
          }, 45);
          intervals.push(scrambleInterval);

          const finishTimer = setTimeout(() => {
            clearInterval(scrambleInterval);
            setCharacters((current) => {
              const next = [...current];
              next[index] = character;
              return next;
            });
            setDecoded((current) => {
              const next = [...current];
              next[index] = true;
              return next;
            });
          }, duration);
          timers.push(finishTimer);
        },
        delay + index * stagger,
      );

      timers.push(startTimer);
    });

    return () => {
      timers.forEach(clearTimeout);
      intervals.forEach(clearInterval);
    };
  }, [delay, duration, stagger, started, text]);

  return (
    <span
      ref={decoderRef}
      className={`${styles.decoder} ${className ?? ""}`}
      aria-label={text}
    >
      {characters.map((character, index) => (
        <span className={styles.slot} key={index}>
          <span className={styles.ghost} aria-hidden="true">
            {text[index]}
          </span>
          <span
            className={`${styles.visual} ${
              character === " "
                ? styles.space
                : visible[index]
                  ? decoded[index]
                    ? styles.character
                    : styles.scrambling
                  : styles.hidden
            }`}
            aria-hidden="true"
          >
            {character}
          </span>
        </span>
      ))}
    </span>
  );
}

export default DecoderText;
