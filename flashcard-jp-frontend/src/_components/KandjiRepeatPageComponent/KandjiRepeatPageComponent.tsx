"use client";

import styles from "./kandjiRepeatPageComponent.module.scss";
import { useState } from "react";
import { FlashCard } from "../FlashCard/FlashCard";
import Button from "../UI/Button/Button";
import { motion } from "framer-motion";
import { IKanji } from "@/_interface/Interface";
import { updateKanjiWeight } from "@/_utils/api/client/kanjiApi";
import separateDuplicatesShuffleCards from "@/_utils/separateDuplicates";
import WritingPractice from "../WritingPractice/WritingPractice";
import SessionProgress from "../SessionProgress/SessionProgress";

export default function KandjiRepeatPageComponent({
  kanji,
}: {
  kanji: IKanji[];
}) {
  const [learnedCards, setLearnedCards] = useState<IKanji[]>(kanji);
  const [indexCard, setIndexCard] = useState(0);
  const [selectCategory, setSelectCategory] = useState("all");
  const [direction, setDirection] = useState(0);
  const [answered, setAnswered] = useState<Set<string>>(new Set());

  function nextCard() {
    setDirection(1);
    setIndexCard((prev) => (prev === learnedCards.length - 1 ? 0 : prev + 1));
  }

  function previousCard() {
    setDirection(-1);
    setIndexCard((prev) => (prev === 0 ? learnedCards.length - 1 : prev - 1));
  }

  function markProgress(cardId: string) {
    setAnswered((prev) => {
      const newSet = new Set(prev);
      newSet.add(cardId);
      return newSet;
    });
  }

  function updateKanjiCardWeight(status: "remember" | "forgot") {
    const currentCard = learnedCards[indexCard];

    if (!currentCard) return;

    updateKanjiWeight(currentCard, { status: status })
      .then(() => {
        markProgress(`${currentCard._id}-${indexCard}`);
        nextCard();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function shuffleCards() {
    setLearnedCards((prev) => separateDuplicatesShuffleCards<IKanji>(prev));
    setIndexCard(0);
    setDirection(0);
    setAnswered(new Set());
  }

  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const category = e.target.value;

    const filteredCards =
      category === "all"
        ? kanji
        : kanji.filter((card) => card.level === category);

    setSelectCategory(category);
    setLearnedCards(filteredCards);
    setIndexCard(0);
    setDirection(0);
    setAnswered(new Set());
  }

  if (!kanji.length)
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
          <label className={styles.kandjirepeatpagecomponent__form_field}>
            <select
              className={styles.kandjirepeatpagecomponent__lists}
              onChange={handleCategoryChange}
              value={selectCategory}
            >
              <option value={"all"}>Все</option>
              <option value={"N5"}>N5</option>
              <option value={"N4"}>N4</option>
              <option value={"N3"}>N3</option>
              <option value={"N2"}>N2</option>
              <option value={"N1"}>N1</option>
            </select>
          </label>
          {learnedCards.length === 0 ? (
            <div>
              <p className={styles.kandjirepeatpagecomponent__loading}>
                Таких кандзи пока не добавлено
              </p>
            </div>
          ) : (
            <>
              <SessionProgress
                length={learnedCards.length}
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
                    <p
                      className={`${styles.flashcard__text} ${styles.flashcard__text_type_front}`}
                    >
                      {learnedCards[indexCard].kanji}
                    </p>
                  }
                  back={
                    <div className={styles.flashcard__text_lists}>
                      <p
                        className={`${styles.flashcard__text} ${styles.flashcard__text_type_jpread}`}
                      >
                        {learnedCards[indexCard].jpRead}
                      </p>
                      <p
                        className={`${styles.flashcard__text} ${styles.flashcard__text_type_chread}`}
                      >
                        {learnedCards[indexCard].chinaRead}
                      </p>
                      <p className={styles.flashcard__text}>
                        {learnedCards[indexCard].translate}
                      </p>
                    </div>
                  }
                />
              </motion.div>
              <WritingPractice
                key={`${learnedCards[indexCard]._id}-${indexCard}`}
                translate={learnedCards[indexCard].translate}
              />
            </>
          )}
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
        <Button type="button" onClick={shuffleCards}>
          Перемешать
        </Button>
      </div>
    </div>
  );
}
