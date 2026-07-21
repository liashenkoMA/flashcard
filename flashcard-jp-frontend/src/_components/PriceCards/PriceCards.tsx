import styles from "./pricecard.module.scss";
import Button from "../UI/Button/Button";

export default function PriceCards() {
  return (
    <div className={styles.pricecards}>
      <div className={styles.pricecards__card}>
        <span className={styles.pricecards__badge}>Первый шаг</span>
        <h3 className={styles.pricecards__title}>1 месяц</h3>
        <p className={styles.pricecards__subtitle}>Для знакомства</p>
        <div className={styles.pricecards__price}>300 ₽</div>
        <div className={styles.pricecards__discount}>Без скидки</div>
        <p className={styles.pricecards__description}>
          Отличный вариант, чтобы попробовать сервис и оценить все его
          возможности и преимущества.
        </p>
        <Button>Купить</Button>
      </div>

      <div
        className={`${styles.pricecards__card} ${styles.pricecards__card_popular}`}
      >
        <span className={styles.pricecards__badge}>Самый популярный</span>
        <h3 className={styles.pricecards__title}>6 месяцев</h3>
        <p className={styles.pricecards__subtitle}>Оптимальный выбор</p>
        <div className={styles.pricecards__price}>
          1 620 ₽<span className={styles.pricecards__oldPrice}>1 800 ₽</span>
        </div>
        <div className={styles.pricecards__discount}>Экономия 10%</div>
        <p className={styles.pricecards__description}>
          Достаточный срок, чтобы сформировать привычку к регулярным занятиям и
          заложить крепкую основу.
        </p>
        <Button>Купить</Button>
      </div>

      <div
        className={`${styles.pricecards__card} ${styles.pricecards__card_best}`}
      >
        <span className={styles.pricecards__badge}>Максимальная выгода</span>
        <h3 className={styles.pricecards__title}>12 месяцев</h3>
        <p className={styles.pricecards__subtitle}>Для лучшего результата</p>
        <div className={styles.pricecards__price}>
          2 880 ₽<span className={styles.pricecards__oldPrice}>3 600 ₽</span>
        </div>
        <div className={styles.pricecards__discount}>Экономия 20%</div>
        <p className={styles.pricecards__description}>
          Самая выгодная стоимость и достаточно времени, чтобы уверенно
          продвинуться в изучении языка.
        </p>
        <Button>Купить</Button>
      </div>
    </div>
  );
}
