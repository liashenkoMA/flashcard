import styles from "./price.module.scss";
import PriceCards from "@/_components/PriceCards/PriceCards";

export default function Price() {
  return (
    <section className={styles.price}>
      <h1 className={styles.price__title}>Выберите срок подписки</h1>
      <div className={styles.price__content}>
        <p className={styles.price__text}>
          Приобретая подписку, вы получаете неограниченный доступ ко всем
          возможностям приложения:
        </p>
        <ul className={styles.price__lists}>
          <li className={styles.price__list}>
            ✓ Создавайте собственные карточки без ограничений
          </li>
          <li className={styles.price__list}>
            ✓ Учите слова и иероглифы с помощью{" "}
            <span className={styles.price__text_accent}>
              интервального повторения
            </span>
          </li>
          <li className={styles.price__list}>
            ✓ Закрепляйте знания — система сама подбирает карточки для
            повторения
          </li>
        </ul>
        <p className={styles.price__text}>
          Алгоритм{" "}
          <span className={styles.price__text_accent}>
            интервального повторения
          </span>{" "}
          адаптирует обучение под вас: сложные карточки появляются чаще, чтобы
          лучше закрепить материал, а уже знакомые — реже, чтобы вы не тратили
          время на то, что уже хорошо запомнили. Система помогает распределять
          время между новыми знаниями и повторением, делая обучение более
          эффективным.
        </p>
        <PriceCards />
      </div>
    </section>
  );
}
