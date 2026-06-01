"use client";

import styles from "./flashcard.module.scss";
import { useState } from "react";

export function FlashCard({
  front,
  back,
}: {
  front: React.ReactNode;
  back: React.ReactNode;
}) {
  const [isFlip, setIsFlip] = useState(false);

  return (
    <div className={styles.flashcard}>
      <div
        className={`${styles.flashcard__card}  ${isFlip ? styles.card__animation_flipped : ""}`}
        onClick={() => setIsFlip(!isFlip)}
      >
        <div
          className={`${styles.flashcard__frontside} ${isFlip ? styles.flashcard__flipped : ""}`}
        >
          {front}
        </div>
        <div
          className={`${styles.flashcard__backside} ${isFlip ? "" : styles.flashcard__flipped}`}
        >
          {back}
        </div>
      </div>
    </div>
  );
}
