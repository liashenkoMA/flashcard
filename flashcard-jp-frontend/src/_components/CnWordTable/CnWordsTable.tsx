"use client";

import styles from "./cnWordsTable.module.scss";
import { useState } from "react";
import { ICnWord } from "@/_interface/Interface";
import { deleteCnWord } from "@/_utils/api/client/cnWordsApi";
import Accordion from "../UI/Accordion/Accordion";
import CnWordTableRow from "../CnWordsTableRow/CnWordsTableRow";

export default function CnWordsTable({ words }: { words: ICnWord[] }) {
  const [wordsState, setWords] = useState(words);

  function handleDeleteWord(el: ICnWord) {
    deleteCnWord(el)
      .then(() => {
        setWords((prev) => prev.filter((k) => k._id !== el._id));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <Accordion header="Таблица слов">
      <ul className={styles.tablecnwords__lists}>
        {wordsState.length ? (
          wordsState.map((el) => (
            <CnWordTableRow
              key={el._id}
              word={el}
              deleteWord={() => handleDeleteWord(el)}
            />
          ))
        ) : (
          <p className={styles.tablecnwords__text}>Пока карточек нет</p>
        )}
      </ul>
    </Accordion>
  );
}
