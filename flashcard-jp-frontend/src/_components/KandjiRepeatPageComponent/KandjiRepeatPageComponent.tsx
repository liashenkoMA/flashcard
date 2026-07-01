"use client";

import styles from "./kandjiRepeatPageComponent.module.scss";
import { useEffect, useState } from "react";
import { FlashCard } from "../FlashCard/FlashCard";
import Button from "../UI/Button/Button";
import { motion } from "framer-motion";
import { IKanji } from "@/_interface/Interface";
import { updateKanjiWeight } from "@/_utils/api/client/kanjiApi";
import separateDuplicatesShuffleCards from "@/_utils/separateDuplicates";
import WritingPractice from "../WritingPractice/WritingPractice";

export default function KandjiRepeatPageComponent({
  kanji,
}: {
  kanji: IKanji[];
}) {
  const [cards, setCards] = useState<IKanji[]>([]);
  const [indexCard, setIndexCard] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    setCards(separateDuplicatesShuffleCards<IKanji>(kanji));
  }, [kanji]);

  function nextCard() {
    setDirection(1);
    setIndexCard((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
  }

  function previousCard() {
    setDirection(-1);
    setIndexCard((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
  }

  function updateKanjiCardWeight(status: "remember" | "forgot") {
    const currentCard = cards[indexCard];

    if (!currentCard) return;

    updateKanjiWeight(currentCard, { status: status })
      .then(() => nextCard())
      .catch((err) => {
        console.log(err);
      });
  }

  if (!cards.length)
    return (
      <div>
        <p className={styles.kandjirepeatpagecomponent__loading}>
          Идет загрузка или карточки еще не созданы.
        </p>
      </div>
    );

  return (
    <div className={styles.kandjirepeatpagecomponent}>
      <div className={styles.kandjirepeatpagecomponent__inner}>
        <div className={styles.kandjirepeatpagecomponent__cards}>
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
                <p
                  className={`${styles.flashcard__text} ${styles.flashcard__text_type_front}`}
                >
                  {cards[indexCard].kanji}
                </p>
              }
              back={
                <div className={styles.flashcard__text_lists}>
                  <p
                    className={`${styles.flashcard__text} ${styles.flashcard__text_type_jpread}`}
                  >
                    {cards[indexCard].jpRead}
                  </p>
                  <p
                    className={`${styles.flashcard__text} ${styles.flashcard__text_type_chread}`}
                  >
                    {cards[indexCard].chinaRead}
                  </p>
                  <p className={styles.flashcard__text}>
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
        <div className={styles.kandjirepeatpagecomponent__cards_navigation}>
          <Button
            type="button"
            variant="danger"
            onClick={() => updateKanjiCardWeight("forgot")}
          >
            Не помню
          </Button>
          <Button
            type="button"
            variant="success"
            onClick={() => updateKanjiCardWeight("remember")}
          >
            Помню
          </Button>
        </div>
      </div>
    </div>
  );
}
