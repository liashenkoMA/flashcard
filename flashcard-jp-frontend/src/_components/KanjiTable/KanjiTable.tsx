"use client";

import styles from "./kanjiTables.module.scss";
import Accordion from "../UI/Accordion/Accordion";
import { IKanji } from "@/_interface/Interface";
import KanjiTableRow from "../KanjiTableRow/KanjiTableRow";
import { useState } from "react";

export default function KanjiTable({ kanji }: { kanji: IKanji[] }) {
  const [kanjiState, setKanji] = useState(kanji);

  function deleteKanji(el: IKanji) {}

  return (
    <Accordion header="Таблица кандзи">
      <ul className={styles.tableKanji__lists}>
        {kanjiState.map((el) => (
          <KanjiTableRow
            key={el._id}
            kanji={el}
            deleteKanji={() => deleteKanji(el)}
          />
        ))}
      </ul>
    </Accordion>
  );
}
