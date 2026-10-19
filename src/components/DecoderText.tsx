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
      {(() => {
        const words = text.split(" ");

        return words.map((word, wordIndex) => {
          const wordStart = words
            .slice(0, wordIndex)
            .reduce(
              (total, previousWord) => total + previousWord.length + 1,
              0,
            );

          return (
            <span className={styles.word} key={`${word}-${wordIndex}`}>
              {Array.from(word).map((character, index) => {
                const currentIndex = wordStart + index;
                const decodedCharacter = characters[currentIndex];

                return (
                  <span className={styles.slot} key={currentIndex}>
                    <span className={styles.ghost} aria-hidden="true">
                      {character}
                    </span>
                    <span
                      className={`${styles.visual} ${
                        visible[currentIndex]
                          ? decoded[currentIndex]
                            ? styles.character
                            : styles.scrambling
                          : styles.hidden
                      }`}
                      aria-hidden="true"
                    >
                      {decodedCharacter}
                    </span>
                  </span>
                );
              })}
              {wordIndex < words.length - 1 ? (
                <span className={styles.wordSpace} aria-hidden="true">
                  {" "}
                </span>
              ) : null}
            </span>
          );
        });
      })()}
    </span>
  );
}

export default DecoderText;
