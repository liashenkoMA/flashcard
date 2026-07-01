"use client";

import styles from "./greeting.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "@/_store/store";

export default function Greeting() {
  const userName = useSelector((state: RootState) => state.auth.userName);

  return (
    <section className={styles.greeting}>
      <div className={styles.greeting__header}>
        <h1 className={styles.greeting__title}>
          Добро пожаловать,{" "}
          <span className={styles.greeting__title_colored}>{userName}!</span>
        </h1>
        <p className={styles.greeting__text}>
          Продолжай учиться каждый день — маленькие шаги приводят к большим
          результатам.
        </p>
      </div>
    </section>
  );
}
