"use client";

import styles from "./krWordTable.module.scss";
import { IWord } from "@/_interface/Interface";
import { deleteKrWord } from "@/_utils/api/client/krWordsApi";
import { useState } from "react";
import Accordion from "../UI/Accordion/Accordion";
import WordTableRow from "../WordTableRow/WordTableRow";

export default function KrWordTable({ words }: { words: IWord[] }) {
  const [wordsState, setWord] = useState(words);

  function handleDeleteWords(el: IWord) {
    deleteKrWord(el)
      .then(() => {
        setWord((prev) => prev.filter((k) => k._id !== el._id));
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <Accordion header="Таблица корейских слов">
      <ul className={styles.krTableWords__lists}>
        {wordsState.length ? (
          wordsState.map((el) => (
            <WordTableRow
              key={el._id}
              word={el}
              deleteword={() => handleDeleteWords(el)}
            />
          ))
        ) : (
          <p className={styles.krTableWords__text}>Пока карточек нет</p>
        )}
      </ul>
    </Accordion>
  );
}
