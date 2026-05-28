"use client";

import styles from "./KanaPageComponent.module.scss";
import { useEffect, useState } from "react";
import { FlashCard } from "../FlashCard/FlashCard";
import { IKana } from "@/_interface/Interface";
import Button from "../UI/Button/Button";
import { motion } from "framer-motion";
import { updateHirakana } from "@/_utils/client/kanaApi";

function shuffle(arr: IKana[]) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default function KanaPageComponent({
  kana,
  params,
}: {
  kana: IKana[];
  params: string;
}) {
  const [cards, setCards] = useState<IKana[]>([]);
  const [indexCard, setIndexCard] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    setCards(shuffle(kana));
  }, [kana]);

  function nextCard() {
    setDirection(1);
    setIndexCard((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
  }

  function previousCard() {
    setDirection(-1);
    setIndexCard((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
  }

  function handleUpdateHiragana() {
    const currentCard = cards[indexCard];
    const updateKana = params === "hiragana" ? updateHirakana : updateHirakana;

    updateKana(currentCard)
      .then(() => {
        setCards((prev) => prev.filter((_, index) => index !== indexCard));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  if (!cards.length) return <div>Загрузка...</div>;

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
