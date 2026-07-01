"use client";

import { useState } from "react";
import styles from "./writingPractice.module.scss";

type Status = "default" | "success" | "error";

export default function WritingPractice({
  cardId,
  translate,
}: {
  cardId: string;
  translate: string;
}) {
  const [answer, setAnswer] = useState<{
    cardId: string;
    value: string;
    status: Status;
  }>({
    cardId,
    value: "",
    status: "default",
  });

  const value = answer.cardId === cardId ? answer.value : "";
  const status = answer.cardId === cardId ? answer.status : "default";

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAnswer({
      cardId,
      value: e.target.value.trim(),
      status: "default",
    });
  }

  function checkResult() {
    const isCorrect = value.toLowerCase() === translate.trim().toLowerCase();

    setAnswer((prev) => ({
      ...prev,
      status: isCorrect ? "success" : "error",
    }));
  }

  return (
    <div className={styles.writingPractice}>
      <input
        type="text"
        className={styles.writingPractice__input}
        value={value}
        name="Вариант"
        onChange={handleChange}
      />

      <button
        type="button"
        className={`
          ${styles.writingPractice__button}
          ${
            status === "success"
              ? styles.writingPractice__button_success
              : status === "error"
                ? styles.writingPractice__button_error
                : ""
          }
        `}
        onClick={checkResult}
      />
    </div>
  );
}
