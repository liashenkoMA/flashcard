"use client";

import styles from "./cta.module.scss";
import Button from "../UI/Button/Button";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/_store/store";
import { setMode } from "@/_store/modalSlice";
import { useRouter } from "next/navigation";

export default function CTA() {
  const dispatch = useDispatch();
  const userName = useSelector((state: RootState) => state.auth.userName);
  const router = useRouter();

  function handleClick(type: { mode: "login" | "register" | null }) {
    dispatch(setMode(type));
  }
  return (
    <section className={styles.cta}>
      <div className={styles.cta__content}>
        <div className={styles.cta__info}>
          <h2 className={styles.cta__title}>Готовы начать?</h2>
          <p className={styles.cta__text}>
            Создавайте свою базу знаний, повторяйте материал и изучайте
            японский, китайский и корейский языки удобнее и быстрее.
          </p>
        </div>
        {userName ? (
          <Button type="button" onClick={() => router.push("/dashboard")}>
            В личный кабинет
          </Button>
        ) : (
          <Button
            type="button"
            onClick={() => handleClick({ mode: "register" })}
          >
            Начать бесплатно
          </Button>
        )}
      </div>
    </section>
  );
}
