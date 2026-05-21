"use client";

import styles from "./accordion.module.scss";
import { useState } from "react";

export default function Accordion({
  header,
  children,
}: {
  header: string;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.accordion}>
      <button
        className={styles.accordion__heading}
        onClick={() => setIsOpen(!isOpen)}
      >
        {header}
        <div
          className={`${`${isOpen ? styles.accordion__icon_type_close : styles.accordion__icon_type_open}`}`}
        ></div>
      </button>
      <div
        className={`${styles.accordion__content} ${isOpen ? "" : styles.accordion__content_type_close}`}
      >
        {children}
      </div>
    </div>
  );
}
