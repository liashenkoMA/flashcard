import styles from "./pageHero.module.scss";

export default function PageHero() {
  return (
    <section className={styles.pagehero}>
      <div className={styles.pagehero__head}>
        <h1 className={styles.pagehero__title}>
          Учите японский, китайский и корейский эффективно с
          <span className={styles.pagehero__title_colored}>
            {" "}
            флеш-карточками
          </span>
        </h1>
        <p className={`${styles.pagehero__text}`}>
          Запоминайте слова, кандзи, ханзи и хангыль с помощью удобных карточек.
          Добавляйте материал из своих учебников и курсов, повторяйте и следите
          за прогрессом.
        </p>
      </div>

      <div className={styles.pagehero__advantages}>
        <p className={`${styles.pagehero__text} ${styles.pagehero__advantage}`}>
          <span
            className={`${styles.pagehero__icon} ${styles.pagehero__icon_start}`}
            aria-hidden="true"
          />
          Бесплатный старт
        </p>

        <p className={`${styles.pagehero__text} ${styles.pagehero__advantage}`}>
          <span
            className={`${styles.pagehero__icon} ${styles.pagehero__icon_device}`}
            aria-hidden="true"
          />
          Работает на всех устройствах
        </p>

        <p className={`${styles.pagehero__text} ${styles.pagehero__advantage}`}>
          <span
            className={`${styles.pagehero__icon} ${styles.pagehero__icon_ad}`}
            aria-hidden="true"
          />
          Без рекламы
        </p>
      </div>
    </section>
  );
}
