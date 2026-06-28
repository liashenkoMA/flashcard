import styles from "./pageHeader.module.scss";

export default function PageHeader() {
  return (
    <section className={styles.pageheader}>
      <div className={styles.pageheader__head}>
        <h1 className={styles.pageheader__title}>
          Учите японский, китайский и корейский эффективно с
          <span className={styles.pageheader__title_colored}>
            {" "}
            флеш-карточками
          </span>
        </h1>
        <p className={`${styles.pageheader__text}`}>
          Создавайте свои наборы, повторяйте, запоминайте и отслеживайте свой
          прогресс каждый день.
        </p>
      </div>
      
      <div className={styles.pageheader__advantages}>
        <p
          className={`${styles.pageheader__text} ${styles.pageheader__advantage}`}
        >
          <span
            className={`${styles.pageheader__icon} ${styles.pageheader__icon_start}`}
          />
          Бесплатный старт
        </p>

        <p
          className={`${styles.pageheader__text} ${styles.pageheader__advantage}`}
        >
          <span
            className={`${styles.pageheader__icon} ${styles.pageheader__icon_device}`}
          />
          Работает на всех устройствах
        </p>

        <p
          className={`${styles.pageheader__text} ${styles.pageheader__advantage}`}
        >
          <span
            className={`${styles.pageheader__icon} ${styles.pageheader__icon_ad}`}
          />
          Без рекламы
        </p>
      </div>
    </section>
  );
}
