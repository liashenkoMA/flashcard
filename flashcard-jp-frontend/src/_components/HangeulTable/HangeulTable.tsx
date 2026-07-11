"use client";

import { IHangeul } from "@/_interface/Interface";
import styles from "./hangeulTable.module.scss";
import { useState } from "react";
import { updateHangeul } from "@/_utils/api/client/hangeulApi";
import Accordion from "../UI/Accordion/Accordion";
import HangeulTableRow from "../HangeulTableRow/HangeulTableRow";

export default function HangeulTable({ hangeul }: { hangeul: IHangeul[] }) {
  const [hangeulState, setHangeulState] = useState(hangeul);

  function toggleHangeul(el: IHangeul) {
    updateHangeul(el)
      .then(() =>
        setHangeulState((hangeul) =>
          hangeul.map((h) =>
            h.symbol === el.symbol ? { ...h, learned: !h.learned } : h,
          ),
        ),
      )
      .catch((err: Error) => console.log(err));
  }
  return (
    <Accordion header="Таблица hangeul">
      <ul className={styles.tableHangeul__lists}>
        {hangeulState.map((el) => (
          <HangeulTableRow
            key={el.symbol}
            hangeul={el}
            updateHangeul={() => toggleHangeul(el)}
          />
        ))}
      </ul>
    </Accordion>
  );
}
