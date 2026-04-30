"use client";

import styles from "./flashcard.module.scss";
import { useState } from "react";
import { IKana } from "@/_interface/Interface";

export function FlashCard({ card }: { card: IKana }) {
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
          <p className={styles.flashcard__text}>{card.symbol}</p>
        </div>
        <div
          className={`${styles.flashcard__backside} ${isFlip ? "" : styles.flashcard__flipped}`}
        >
          <p className={styles.flashcard__text}>{card.romaji}</p>
        </div>
      </div>
    </div>
  );
}
