"use client";

import { useState } from "react";
import styles from "./writingPractice.module.scss";

type Status = "default" | "success" | "error";

export default function WritingPractice({ translate }: { translate: string }) {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<Status>("default");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    setStatus("default");
    setText(value);
  }

  function checkResult() {
    if (text.toLowerCase().trim() === translate.toLowerCase().trim()) {
      setStatus("success");
    } else {
      setStatus("error");
    }
  }

  return (
    <div className={styles.writingPractice}>
      <input
        type="text"
        className={styles.writingPractice__input}
        value={text}
        name="Вариант"
        placeholder="Перевод"
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
