"use client";

import styles from "./hangeulPageComponent.module.scss";
import { IHangeul } from "@/_interface/Interface";
import {
  updateHangeul,
  updateHangeulWeight,
} from "@/_utils/api/client/hangeulApi";
import separateDuplicatesShuffleCards from "@/_utils/separateDuplicates";
import { useState } from "react";
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
  const [cards, setCards] = useState<IHangeul[]>(hangeul);
  const [indexCard, setIndexCard] = useState(0);
  const [selectCategory, setSelectCategory] = useState("all");
  const [direction, setDirection] = useState(0);
  const [answered, setAnswered] = useState<Set<string>>(new Set());
  const [sessionLength, setSessionLength] = useState(hangeul.length);
  const group = [
    "basic-consonant",
    "double-consonant",
    "basic-vowel",
    "compound-vowel",
  ];

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

    updateHangeulWeight(currentCard, { status })
      .then(() => {
        markProgress(`${currentCard._id}-${indexCard}`);
        nextCard();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function shuffleCards() {
    setCards((prev) => separateDuplicatesShuffleCards<IHangeul>(prev));

    setIndexCard(0);
    setDirection(0);
    setAnswered(new Set());
  }

  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const category = e.target.value;

    const filteredCards =
      category === "all"
        ? hangeul
        : hangeul.filter((card) => card.group === category);

    setSelectCategory(category);
    setCards(filteredCards);
    setIndexCard(0);
    setDirection(0);
    setAnswered(new Set());
    setSessionLength(filteredCards.length);
  }

  if (!hangeul.length)
    return (
      <div>
        <p className={styles.hangeulPageComponent__loading}>Загрузка...</p>
      </div>
    );

  return (
    <div className={styles.hangeulPageComponent}>
      <div className={styles.hangeulPageComponent__inner}>
        <div className={styles.hangeulPageComponent__cards}>
          <label className={styles.hangeulPageComponent__form_field}>
            <select
              className={styles.hangeulPageComponent__lists}
              onChange={handleCategoryChange}
              value={selectCategory}
            >
              <option value="all">Все</option>
              {group.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </label>
          {!cards.length ? (
            <div>
              <p className={styles.hangeulPageComponent__loading}>
                В этой группе пока нет карточек
              </p>
            </div>
          ) : (
            <>
              <SessionProgress
                length={sessionLength}
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
                initial={{
                  x: direction > 0 ? 300 : -300,
                  opacity: 0,
                }}
                animate={{
                  x: 0,
                  opacity: 1,
                }}
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
            </>
          )}
        </div>
        {searchParams.type === "repeat" ? (
          <>
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

            <Button type="button" onClick={shuffleCards}>
              Перемешать
            </Button>
          </>
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
            <Button type="button" onClick={shuffleCards}>
              Перемешать
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
