"use client";

import styles from "./reviews.module.scss";
import { ReviewsCard } from "../ReviewsCard/ReviewsCard";
import { REVIEWS } from "@/_constants/reviews.constant";
import { useEffect, useRef } from "react";

const extendedReviews = [...REVIEWS, ...REVIEWS, ...REVIEWS];

export default function Reviews() {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const slideRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = viewportRef.current;

    if (!container) return;

    container.style.scrollBehavior = "auto";

    container.scrollLeft = container.scrollWidth / 3;

    requestAnimationFrame(() => {
      container.style.scrollBehavior = "smooth";
    });
  }, []);

  function scroll(direction: "left" | "right") {
    const container = viewportRef.current;
    const slide = slideRef.current;

    if (!container || !slide) return;

    const gap = 20;

    const amount = slide.offsetWidth + gap;

    container.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  }

  function checkScroll() {
    const container = viewportRef.current;

    if (!container) return;

    const oneListWidth = container.scrollWidth / 3;

    // Если скроллим вправо
    if (container.scrollLeft >= oneListWidth * 2) {
      container.style.scrollBehavior = "auto";

      container.scrollLeft -= oneListWidth;

      container.style.scrollBehavior = "smooth";
    }

    // Если скроллим влево
    if (container.scrollLeft <= 0) {
      container.style.scrollBehavior = "auto";

      container.scrollLeft += oneListWidth;

      container.style.scrollBehavior = "smooth";
    }
  }

  return (
    <section className={styles.reviews}>
      <div className={styles.reviews__header}>
        <span className={styles.reviews__span}>Отзывы</span>
        <h2 className={styles.reviews__title}>Что рассказывают пользователи</h2>
        <p
          className={`${styles.reviews__text} ${styles.reviews__text_subtitle}`}
        >
          Сотни людей уже пользуются нашим сервисом!
        </p>
      </div>

      <div className={styles.reviews__content}>
        <button
          type="button"
          className={`${styles.reviews__btn} ${styles.reviews__btn_left}`}
          onClick={() => scroll("left")}
        />
        <div
          className={styles.reviews__viewport}
          ref={viewportRef}
          onScroll={checkScroll}
        >
          <div className={styles.reviews__track}>
            {extendedReviews.map((card, index) => (
              <div className={styles.reviews__slide} key={index} ref={slideRef}>
                <ReviewsCard card={card} />
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          className={`${styles.reviews__btn} ${styles.reviews__btn_right}`}
          onClick={() => scroll("right")}
        />
      </div>
    </section>
  );
}
