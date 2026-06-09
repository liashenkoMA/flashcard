"use client";

import { IWord } from "@/_interface/Interface";
import styles from "./wordsRepeatPageComponent.module.scss";
import { useEffect, useState } from "react";
import shuffle from "@/_utils/shuffle";
import { motion } from "framer-motion";
import { FlashCard } from "../FlashCard/FlashCard";
import Button from "../UI/Button/Button";

export default function WordsRepeatPageComponent({
  words,
}: {
  words: IWord[];
}) {
  const [cards, setCards] = useState<IWord[]>([]);
  const [indexCard, setIndexCard] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    setCards(shuffle<IWord>(words));
  }, [words]);

  function nextCard() {
    setDirection(1);
    setIndexCard((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
  }

  function previousCard() {
    setDirection(-1);
    setIndexCard((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
  }

  if (!cards.length) return <div>Загрузка...</div>;

  return (
    <div className={styles.wordsrepeatpagecomponent}>
      <div className={styles.wordsrepeatpagecomponent__inner}>
        <div className={styles.wordsrepeatpagecomponent__cards}>
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
        </div>
        <div className={styles.wordsrepeatpagecomponent__cards_navigation}>
          <Button type="button" onClick={previousCard}>
            Назад
          </Button>
          <Button type="button" onClick={nextCard}>
            Вперед
          </Button>
        </div>
        <div className={styles.wordsrepeatpagecomponent__cards_navigation}>
          <Button type="button" variant="danger" onClick={previousCard}>
            Не знаю
          </Button>
          <Button type="button" variant="success" onClick={nextCard}>
            Знаю
          </Button>
        </div>
      </div>
    </div>
  );
}
