"use client";

import styles from "./KanaPageComponent.module.scss";
import { getHiragana, updateHiragana } from "@/_utils/kanaApi";
import { useEffect, useState } from "react";
import { FlashCard } from "../FlashCard/FlashCard";
import { IKana } from "@/_interface/Interface";
import Button from "../UI/Button/Button";
import { motion } from "framer-motion";

export default function KanaPageComponent() {
  const [cards, setCards] = useState<IKana[]>([]);
  const [indexCard, setIndexCard] = useState(0);
  const [direction, setDirection] = useState(0);

  function shuffle(arr: IKana[]) {
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  useEffect(() => {
    async function fetchKana() {
      await getHiragana()
        .then((res) => {
          setCards(shuffle(res));
        })
        .catch((err) => console.log(err));
    }

    fetchKana();
  }, []);

  function nextCard() {
    setDirection(1);
    setIndexCard(indexCard === cards.length - 1 ? 0 : indexCard + 1);
  }

  function previousCard() {
    setDirection(-1);
    setIndexCard(indexCard === 0 ? cards.length - 1 : indexCard - 1);
  }

  function handleUpdateHiragana() {
    updateHiragana(cards[indexCard])
      .then(() => {
        setCards((cards) => cards.filter((card) => card !== cards[indexCard]));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  if (!cards.length) return <div>Loading...</div>;

  return (
    <div className={styles.kanaPageComponent}>
      <div className={styles.kanaPageComponent__inner}>
        <div className={styles.kanaPageComponent__cards}>
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
            <FlashCard card={cards[indexCard]} />
          </motion.div>
        </div>
        <div className={styles.kanaPageComponent__cards_navigation}>
          <Button type="button" text="Назад" onClick={previousCard} />
          <Button type="button" text="Вперед" onClick={nextCard} />
        </div>
        <Button type="button" text="Выучил" onClick={handleUpdateHiragana} />
      </div>
    </div>
  );
}
