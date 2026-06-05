"use client";

import styles from "./kanjiTables.module.scss";
import Accordion from "../UI/Accordion/Accordion";
import { IKanji } from "@/_interface/Interface";
import KanjiTableRow from "../KanjiTableRow/KanjiTableRow";
import { useState } from "react";
import { deleteKanji } from "@/_utils/api/client/kanjiApi";

export default function KanjiTable({ kanji }: { kanji: IKanji[] }) {
  const [kanjiState, setKanji] = useState(kanji);

  function handleDeleteKanji(el: IKanji) {
    deleteKanji(el)
      .then(() => {
        setKanji((prev) => prev.filter((k) => k._id !== el._id));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <Accordion header="Таблица кандзи">
      <ul className={styles.tableKanji__lists}>
        {kanjiState.map((el) => (
          <KanjiTableRow
            key={el._id}
            kanji={el}
            deleteKanji={() => handleDeleteKanji(el)}
          />
        ))}
      </ul>
    </Accordion>
  );
}
