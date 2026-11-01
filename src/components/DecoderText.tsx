import { useEffect, useRef, useState } from "react";
import styles from "./DecoderText.module.css";

type DecoderTextProps = {
  text: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  startOnView?: boolean;
  onComplete?: () => void;
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
  onComplete,
  className,
}: DecoderTextProps) {
  const decoderRef = useRef<HTMLSpanElement>(null);
  const onCompleteRef = useRef(onComplete);
  const [reducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [started, setStarted] = useState(!startOnView || reducedMotion);
  const [characters, setCharacters] = useState(() =>
    reducedMotion
      ? Array.from(text)
      : Array.from(text, (character) =>
          character === " " ? " " : randomSymbol(),
        ),
  );
  const [decoded, setDecoded] = useState(() =>
    Array.from(text, (character) => reducedMotion || character === " "),
  );
  const [visible, setVisible] = useState(() =>
    Array.from(text, (character) => reducedMotion || character === " "),
  );

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!startOnView || reducedMotion) return;

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
  }, [reducedMotion, startOnView]);

  useEffect(() => {
    if (!started) return;

    if (reducedMotion) {
      onCompleteRef.current?.();
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    const intervals: ReturnType<typeof setInterval>[] = [];
    const characterCount = Array.from(text).filter(
      (character) => character !== " ",
    ).length;
    let completedCharacters = 0;

    if (characterCount === 0) {
      onCompleteRef.current?.();
      return;
    }

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
            completedCharacters += 1;
            if (completedCharacters === characterCount) {
              onCompleteRef.current?.();
            }
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
  }, [delay, duration, reducedMotion, stagger, started, text]);

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
                const isVisible = reducedMotion || visible[currentIndex];
                const isDecoded = reducedMotion || decoded[currentIndex];

                return (
                  <span className={styles.slot} key={currentIndex}>
                    <span className={styles.ghost} aria-hidden="true">
                      {character}
                    </span>
                    <span
                      className={`${styles.visual} ${
                        isVisible
                          ? isDecoded
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
