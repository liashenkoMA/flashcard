"use client";

import styles from "./wordsTable.module.scss";
import Accordion from "../UI/Accordion/Accordion";
import { useState } from "react";
import { IWord } from "@/_interface/Interface";
import { deleteWord } from "@/_utils/api/client/wordApi";
import WordTableRow from "../WordTableRow/WordTableRow";

export default function WordTable({ words }: { words: IWord[] }) {
  const [wordsState, setWord] = useState(words);

  function handleDeleteWords(el: IWord) {
    deleteWord(el)
      .then(() => {
        setWord((prev) => prev.filter((k) => k._id !== el._id));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <Accordion header="Таблица слов">
      <ul className={styles.tableWords__lists}>
        {wordsState.map((el) => (
          <WordTableRow
            key={el._id}
            word={el}
            deleteword={() => handleDeleteWords(el)}
          />
        ))}
      </ul>
    </Accordion>
  );
}
