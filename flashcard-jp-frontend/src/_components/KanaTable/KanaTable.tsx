"use client";

import styles from "./kanaTable.module.scss";
import { updateHiragana, updateKatakana } from "@/_utils/client/kanaApi";
import KanaTableRow from "../KanaTableRow/KanaTableRow";
import Accordion from "../UI/Accordion/Accordion";
import { IKana } from "@/_interface/Interface";
import { useState } from "react";

export default function KanaTable({
  hiragana,
  katakana,
}: {
  hiragana: IKana[];
  katakana: IKana[];
}) {
  const [hiraganaState, setHiraganaState] = useState(hiragana);
  const [katakanaState, setKatakanaState] = useState(katakana);

  function toggleHiragana(el: IKana) {
    updateHiragana(el)
      .then(() =>
        setHiraganaState((kana) =>
          kana.map((k) =>
            k.symbol === el.symbol ? { ...k, learned: !k.learned } : k,
          ),
        ),
      )
      .catch((err: Error) => console.log(err));
  }

  function toggleKatakana(el: IKana) {
    updateKatakana(el)
      .then(() =>
        setKatakanaState((kana) =>
          kana.map((k) =>
            k.symbol === el.symbol ? { ...k, learned: !k.learned } : k,
          ),
        ),
      )
      .catch((err) => console.log(err));
  }

  return (
    <>
      <Accordion header="Таблица хираганы">
        <ul className={styles.tableKana__lists}>
          {hiraganaState.map((el) => (
            <KanaTableRow
              key={el.symbol}
              kana={el}
              updateKana={() => toggleHiragana(el)}
            />
          ))}
        </ul>
      </Accordion>
      <Accordion header="Таблица катаканы">
        <ul className={styles.tableKana__lists}>
          {katakanaState.map((el) => (
            <KanaTableRow
              key={el.symbol}
              kana={el}
              updateKana={() => toggleKatakana(el)}
            />
          ))}
        </ul>
      </Accordion>
    </>
  );
}
