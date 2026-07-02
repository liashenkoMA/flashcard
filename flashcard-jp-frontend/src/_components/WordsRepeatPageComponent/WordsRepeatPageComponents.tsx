"use client";

import styles from "./wordsRepeatPageComponent.module.scss";
import { IWord } from "@/_interface/Interface";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FlashCard } from "../FlashCard/FlashCard";
import Button from "../UI/Button/Button";
import { updateWordWeight } from "@/_utils/api/client/wordApi";
import separateDuplicatesShuffleCards from "@/_utils/separateDuplicates";
import WritingPractice from "../WritingPractice/WritingPractice";
import SessionProgress from "../SessionProgress/SessionProgress";

export default function WordsRepeatPageComponent({
  words,
}: {
  words: IWord[];
}) {
  const [cards, setCards] = useState<IWord[]>([]);
  const [indexCard, setIndexCard] = useState(0);
  const [direction, setDirection] = useState(0);
  const [answered, setAnswered] = useState<Set<string>>(new Set());

  useEffect(() => {
    setCards(separateDuplicatesShuffleCards<IWord>(words));
  }, [words]);

  function nextCard() {
    setDirection(1);
    setIndexCard((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
  }

  function previousCard() {
    setDirection(-1);
    setIndexCard((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
  }

  function markProgress(cardId: string) {
    setAnswered((prev) => {
      const newSet = new Set(prev);
      newSet.add(cardId);
      return newSet;
    });
  }

  function updateWordCardWeight(status: "remember" | "forgot") {
    const currentCard = cards[indexCard];

    if (!currentCard) return;

    updateWordWeight(currentCard, { status: status })
      .then(() => {
        markProgress(`${currentCard._id}-${indexCard}`);
        nextCard();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  if (!cards.length)
    return (
      <div>
        <p className={styles.wordsrepeatpagecomponent__loading}>
          Идет загрузка или карточки еще не созданы.
        </p>
      </div>
    );

  return (
    <div className={styles.wordsrepeatpagecomponent}>
      <div className={styles.wordsrepeatpagecomponent__inner}>
        <div className={styles.wordsrepeatpagecomponent__cards}>
          <SessionProgress
            length={cards.length}
            answeredCount={answered.size}
          />
          <motion.div
            key={indexCard}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.3}
            onDragEnd={(e, info) => {
              if (info.offset.x < -100) {
                nextCard();
              } else if (info.offset.x > 100) {
                previousCard();
              }
            }}
            initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <FlashCard
              front={
                <p className={`${styles.flashcard__text}`}>
                  {cards[indexCard].word}
                </p>
              }
              back={
                <div className={styles.flashcard__text_lists}>
                  <p className={`${styles.flashcard__text}`}>
                    {cards[indexCard].translate}
                  </p>
                </div>
              }
            />
          </motion.div>
          <WritingPractice
            cardId={`${cards[indexCard]._id}-${indexCard}`}
            translate={cards[indexCard].translate}
          />
        </div>
        <div className={styles.wordsrepeatpagecomponent__cards_navigation}>
          <Button
            type="button"
            variant="danger"
            onClick={() => updateWordCardWeight("forgot")}
          >
            Не помню
          </Button>
          <Button
            type="button"
            variant="success"
            onClick={() => updateWordCardWeight("remember")}
          >
            Помню
          </Button>
        </div>
      </div>
    </div>
  );
}
