"use client";

import { ICnWord } from "@/_interface/Interface";
import styles from "./cnWordsRepeanPageComponent.module.scss";
import { useEffect, useState } from "react";
import separateDuplicatesShuffleCards from "@/_utils/separateDuplicates";
import { updateCnWordWeight } from "@/_utils/api/client/cnWordsApi";
import SessionProgress from "../SessionProgress/SessionProgress";
import { motion } from "framer-motion";
import { FlashCard } from "../FlashCard/FlashCard";
import WritingPractice from "../WritingPractice/WritingPractice";
import Button from "../UI/Button/Button";

export default function CnWordsRepeatPageComponent({
  words,
}: {
  words: ICnWord[];
}) {
  const [cards, setCards] = useState<ICnWord[]>([]);
  const [indexCard, setIndexCard] = useState(0);
  const [direction, setDirection] = useState(0);
  const [answered, setAnswered] = useState<Set<string>>(new Set());

  useEffect(() => {
    setCards(separateDuplicatesShuffleCards<ICnWord>(words));
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

  function updateCnWordCardWeight(status: "remember" | "forgot") {
    const currentCard = cards[indexCard];

    if (!currentCard) return;

    updateCnWordWeight(currentCard, { status: status })
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
        <p className={styles.cnwordsrepeatpagecomponent__loading}>
          Идет загрузка или карточки еще не созданы.
        </p>
      </div>
    );

  return (
    <div className={styles.cnwordsrepeatpagecomponent}>
      <div className={styles.cnwordsrepeatpagecomponent__inner}>
        <div className={styles.cnwordsrepeatpagecomponent__cards}>
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
                    {cards[indexCard].pinyin}
                  </p>
                  <p className={`${styles.flashcard__text}`}>
                    {cards[indexCard].translate}
                  </p>
                </div>
              }
            />
          </motion.div>
          <WritingPractice
            key={`${cards[indexCard]._id}-${indexCard}`}
            translate={cards[indexCard].translate}
          />
        </div>
        <div className={styles.cnwordsrepeatpagecomponent__cards_navigation}>
          <Button
            type="button"
            variant="danger"
            onClick={() => updateCnWordCardWeight("forgot")}
          >
            Не помню
          </Button>
          <Button
            type="button"
            variant="success"
            onClick={() => updateCnWordCardWeight("remember")}
          >
            Помню
          </Button>
        </div>
      </div>
    </div>
  );
}
