"use client";

import { IHanzi } from "@/_interface/Interface";
import styles from "./hanzitable.module.scss";
import { useState } from "react";
import { deleteHanzi } from "@/_utils/api/client/hanziApi";
import Accordion from "../UI/Accordion/Accordion";
import HanziTableRow from "../HanzitableRow/HanziTableRow";

export default function HanziTable({ hanzi }: { hanzi: IHanzi[] }) {
  const [hanziState, setHanzi] = useState(hanzi);

  function handleDeleteHanzi(el: IHanzi) {
    deleteHanzi(el)
      .then(() => {
        setHanzi((prev) => prev.filter((k) => k._id !== el._id));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <Accordion header="Таблица ханзи">
      <ul className={styles.tablehanzi__lists}>
        {hanziState.length ? (
          hanziState.map((el) => (
            <HanziTableRow
              key={el._id}
              hanzi={el}
              deleteHanzi={() => handleDeleteHanzi(el)}
            />
          ))
        ) : (
          <p className={styles.tablehanzi__text}>Пока карточек нет</p>
        )}
      </ul>
    </Accordion>
  );
}
