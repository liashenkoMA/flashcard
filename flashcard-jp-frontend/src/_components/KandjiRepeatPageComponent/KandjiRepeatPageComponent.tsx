import styles from "./KandziRepeatPageComponent.module.scss";
import { useEffect, useState } from "react";
import { FlashCard } from "../FlashCard/FlashCard";
import Button from "../UI/Button/Button";
import { motion } from "framer-motion";
import { IKandji } from "@/_interface/Interface";
import shuffle from "@/_utils/shuffle";

export default function KandjiRepeatPageComponent({
  kanji,
}: {
  kanji: IKandji[];
}) {
  const [cards, setCards] = useState<IKandji[]>([]);
  const [indexCard, setIndexCard] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    setCards(shuffle<IKandji>(kanji));
  }, [kanji]);

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
    <div className={styles.kandzirepeatpagecomponent}>
      <div className={styles.kandzirepeatpagecomponent__inner}>
        <div className={styles.kandzirepeatpagecomponent__cards}>
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
                  {cards[indexCard].kanji}
                </p>
              }
              back={
                <p className={styles.flashcard__text}>
                  {cards[indexCard].translate}
                </p>
              }
            />
          </motion.div>
        </div>
        <div className={styles.kandzirepeatpagecomponent__cards_navigation}>
          <Button type="button" onClick={previousCard}>
            Назад
          </Button>
          <Button type="button" onClick={nextCard}>
            Вперед
          </Button>
        </div>
        <div className={styles.kandzirepeatpagecomponent__cards_navigation}>
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
