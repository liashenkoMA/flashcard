import styles from "./introduction.module.scss";

export default function Introduction() {
  return (
    <section className={styles.introduction}>
      <div className={styles.introduction__header}>
        <span className={styles.introduction__span}>Наш подход</span>
        <h2 id="introduction" className={styles.introduction__title}>
          Помощник в изучении азиатских языков
        </h2>
        <p
          className={`${styles.introduction__text} ${styles.introduction__text_subtitle}`}
        >
          Не заменяем учебники и курсы, а помогаем регулярно повторять слова и
          кандзи, чтобы знания действительно оставались в памяти.
        </p>
      </div>
      <div className={styles.introduction__content}>
        <p className={styles.introduction__text}>
          Изучение японского языка требует постоянной практики. Новые слова,
          кандзи и чтения постепенно забываются, если к ним не возвращаться.
          Именно поэтому регулярное повторение играет не меньшую роль, чем
          изучение нового материала.
        </p>

        <p className={styles.introduction__text}>
          <span className={styles.introduction__accent}>Memora</span> не
          пытается заменить учебники, преподавателей или полноценные языковые
          курсы. Его задача гораздо проще — стать удобным инструментом, который
          всегда находится под рукой и помогает повторять уже изученный материал
          в любое свободное время. Достаточно пары минут в автобусе, метро, во
          время ожидания или короткого перерыва, чтобы освежить знания и
          сохранить их в долговременной памяти.
        </p>

        <p className={styles.introduction__text}>
          Идея сервиса появилась из простой проблемы. Для многих языков
          существуют десятки удобных сервисов с карточками, однако найти
          действительно простой и полностью ориентированный на изучение{" "}
          <span className={styles.introduction__accent}>японского языка</span>{" "}
          оказалось непросто. Большинство решений перегружены настройками,
          рассчитаны на англоязычную аудиторию или требуют много времени на
          подготовку собственных материалов. При этом часто хочется открыть сайт
          буквально в пару кликов и сразу начать повторять слова или{" "}
          <span className={styles.introduction__accent}>кандзи</span>.
        </p>

        <p className={styles.introduction__text}>
          Именно поэтому{" "}
          <span className={styles.introduction__accent}>Memora</span> создаётся
          как максимально простой помощник. Без сложной настройки, без лишних
          функций и с акцентом на скорость: открыл сайт, выбрал нужный материал
          и начал{" "}
          <span className={styles.introduction__accent}>повторение</span>. В
          будущем аналогичный подход будет доступен и для китайского, а затем и
          корейского языка, сохраняя единый и привычный интерфейс.
        </p>
      </div>
    </section>
  );
}
