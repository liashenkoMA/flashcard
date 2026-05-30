"use client";

import styles from "./KanaPageComponent.module.scss";
import { useEffect, useState } from "react";
import { FlashCard } from "../FlashCard/FlashCard";
import { IKana } from "@/_interface/Interface";
import Button from "../UI/Button/Button";
import { motion } from "framer-motion";
import { updateHiragana, updateKatakana } from "@/_utils/client/kanaApi";

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
  searchParams,
}: {
  kana: IKana[];
  params: string;
  searchParams: {
    type?: string;
  };
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
    setIndexCard((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
  }

  function handleUpdateKana() {
    const currentCard = cards[indexCard];

    if (!currentCard) return;

    const updateKana = params === "hiragana" ? updateHiragana : updateKatakana;

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
          <Button type="button" onClick={previousCard}>
            Назад
          </Button>
          <Button type="button" onClick={nextCard}>
            Вперед
          </Button>
        </div>
        {searchParams.type === "repeat" ? (
          <div className={styles.kanaPageComponent__cards_navigation}>
            <Button type="button" variant="danger" onClick={previousCard}>
              Не знаю
            </Button>
            <Button type="button" variant="success" onClick={nextCard}>
              Знаю
            </Button>
          </div>
        ) : (
          <Button type="button" onClick={handleUpdateKana}>
            Выучил
          </Button>
        )}
      </div>
    </div>
  );
}
