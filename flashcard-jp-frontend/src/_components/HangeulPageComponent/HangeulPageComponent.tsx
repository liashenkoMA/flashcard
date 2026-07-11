"use client";

import styles from "./hangeulPageComponent.module.scss";
import { IHangeul } from "@/_interface/Interface";
import {
  updateHangeul,
  updateHangeulWeight,
} from "@/_utils/api/client/hangeulApi";
import separateDuplicatesShuffleCards from "@/_utils/separateDuplicates";
import { useEffect, useState } from "react";
import SessionProgress from "../SessionProgress/SessionProgress";
import { motion } from "framer-motion";
import { FlashCard } from "../FlashCard/FlashCard";
import WritingPractice from "../WritingPractice/WritingPractice";
import Button from "../UI/Button/Button";

export default function HangeulPageComponent({
  hangeul,
  searchParams,
}: {
  hangeul: IHangeul[];
  searchParams: { type?: string };
}) {
  const [cards, setCards] = useState<IHangeul[]>([]);
  const [indexCard, setIndexCard] = useState(0);
  const [direction, setDirection] = useState(0);
  const [answered, setAnswered] = useState<Set<string>>(new Set());

  useEffect(() => {
    setCards(separateDuplicatesShuffleCards<IHangeul>(hangeul));
  }, [hangeul]);

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

  function handleUpdateHangeul() {
    const currentCard = cards[indexCard];

    if (!currentCard) return;

    updateHangeul(currentCard)
      .then(() => {
        markProgress(`${currentCard._id}-${indexCard}`);
        setCards((prev) => prev.filter((_, index) => index !== indexCard));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function updateHangeulCardWeight(status: "remember" | "forgot") {
    const currentCard = cards[indexCard];

    if (!currentCard) return;

    updateHangeulWeight(currentCard, { status: status })
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
        <p className={styles.hangeulPageComponent__loading}>Загрузка...</p>
      </div>
    );

  return (
    <div className={styles.hangeulPageComponent}>
      <div className={styles.hangeulPageComponent__inner}>
        <div className={styles.hangeulPageComponent__cards}>
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
                <p className={styles.flashcard__text}>
                  {cards[indexCard].symbol}
                </p>
              }
              back={
                <p className={styles.flashcard__text}>
                  {cards[indexCard].romaji}
                </p>
              }
            />
          </motion.div>
          <WritingPractice
            key={`${cards[indexCard]._id}-${indexCard}`}
            translate={cards[indexCard].romaji}
          />
        </div>
        {searchParams.type === "repeat" ? (
          <div className={styles.hangeulPageComponent__cards_navigation}>
            <Button
              type="button"
              variant="danger"
              onClick={() => updateHangeulCardWeight("forgot")}
            >
              Не помню
            </Button>
            <Button
              type="button"
              variant="success"
              onClick={() => updateHangeulCardWeight("remember")}
            >
              Помню
            </Button>
          </div>
        ) : (
          <>
            <div className={styles.hangeulPageComponent__cards_navigation}>
              <Button type="button" onClick={previousCard}>
                Назад
              </Button>
              <Button type="button" onClick={nextCard}>
                Вперед
              </Button>
            </div>
            <Button
              type="button"
              variant="success"
              onClick={handleUpdateHangeul}
            >
              Запомнил
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
