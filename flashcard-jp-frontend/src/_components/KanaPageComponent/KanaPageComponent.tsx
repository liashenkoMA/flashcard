"use client";

import styles from "./kanaPageComponent.module.scss";
import { useState } from "react";
import { FlashCard } from "../FlashCard/FlashCard";
import { IKana } from "@/_interface/Interface";
import Button from "../UI/Button/Button";
import { motion } from "framer-motion";
import {
  updateHiragana,
  updateHiraganaWeight,
  updateKatakana,
  updateKatakanaWeight,
} from "@/_utils/api/client/kanaApi";
import separateDuplicatesShuffleCards from "@/_utils/separateDuplicates";
import WritingPractice from "../WritingPractice/WritingPractice";
import SessionProgress from "../SessionProgress/SessionProgress";

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
  const [cards, setCards] = useState<IKana[]>(kana);
  const [indexCard, setIndexCard] = useState(0);
  const [selectCategory, setSelectCategory] = useState("all");
  const [direction, setDirection] = useState(0);
  const [answered, setAnswered] = useState<Set<string>>(new Set());
  const [sessionLength, setSessionLength] = useState(kana.length);
  const group = ["a", "k", "s", "t", "n", "h", "m", "y", "r", "w"];

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

  function handleUpdateKana() {
    const currentCard = cards[indexCard];

    if (!currentCard) return;

    const updateKana = params === "hiragana" ? updateHiragana : updateKatakana;

    updateKana(currentCard)
      .then(() => {
        markProgress(`${currentCard._id}-${indexCard}`);
        setCards((prev) => prev.filter((_, index) => index !== indexCard));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function updateKanaCardWeight(status: "remember" | "forgot") {
    const currentCard = cards[indexCard];

    if (!currentCard) return;

    const updateKanaWeight =
      params === "hiragana" ? updateHiraganaWeight : updateKatakanaWeight;

    updateKanaWeight(currentCard, { status: status })
      .then(() => {
        markProgress(`${currentCard._id}-${indexCard}`);
        nextCard();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function shuffleCards() {
    setCards((prev) => separateDuplicatesShuffleCards<IKana>(prev));
    setIndexCard(0);
    setDirection(0);
    setAnswered(new Set());
  }

  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const category = e.target.value;

    const filteredCards =
      category === "all"
        ? kana
        : kana.filter((card) => card.group === category);

    setSelectCategory(category);
    setCards(filteredCards);
    setIndexCard(0);
    setDirection(0);
    setAnswered(new Set());
    setSessionLength(filteredCards.length);
  }

  if (!kana.length)
    return (
      <div>
        <p className={styles.kanaPageComponent__loading}>
          Идет загрузка или каны еще не выучены.
        </p>
      </div>
    );

  return (
    <div className={styles.kanaPageComponent}>
      <div className={styles.kanaPageComponent__inner}>
        <div className={styles.kanaPageComponent__cards}>
          <label className={styles.kanaPageComponent__form_field}>
            <select
              className={styles.kanaPageComponent__lists}
              onChange={handleCategoryChange}
              value={selectCategory}
            >
              <option value={"all"}>Все</option>
              {group.map((el) => (
                <option key={el} value={el}>
                  {el}
                </option>
              ))}
            </select>
          </label>
          {!cards.length ? (
            <div>
              <p className={styles.kanaPageComponent__loading}>
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
            </>
          )}
        </div>
        {searchParams.type === "repeat" ? (
          <>
            <div className={styles.kanaPageComponent__cards_navigation}>
              <Button
                type="button"
                variant="danger"
                onClick={() => updateKanaCardWeight("forgot")}
              >
                Не помню
              </Button>
              <Button
                type="button"
                variant="success"
                onClick={() => updateKanaCardWeight("remember")}
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
            <div className={styles.kanaPageComponent__cards_navigation}>
              <Button type="button" onClick={previousCard}>
                Назад
              </Button>
              <Button type="button" onClick={nextCard}>
                Вперед
              </Button>
            </div>
            <Button type="button" variant="success" onClick={handleUpdateKana}>
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
