import styles from "./dashboard.module.scss";
import Accordion from "@/_components/UI/Accordion/Accordion";
import LinkButton from "@/_components/UI/LinkButton/LinkButton";

export default function Page() {
  return (
    <section className={styles.dashboard}>
      <h1 className={styles.dashboard__title}>Главная</h1>

      <div className={styles.dashboard__section}>
        <Accordion header="Учить">
          <ul className={styles.dashboard__lists}>
            <li className={styles.dashboard__list}>
              <LinkButton href="/kana/katakana" text="Изучить катакану" />
            </li>
          </ul>
          <ul className={styles.dashboard__lists}>
            <li className={styles.dashboard__list}>
              <LinkButton
                href="/kana/katakana?type=repeat"
                text="Повторить катакану"
              />
            </li>
          </ul>
          <ul className={styles.dashboard__lists}>
            <li className={styles.dashboard__list}>
              <LinkButton href="/kana/hiragana" text="Изучить хирагану" />
            </li>
          </ul>
          <ul className={styles.dashboard__lists}>
            <li className={styles.dashboard__list}>
              <LinkButton
                href="/kana/hiragana?type=repeat"
                text="Повторить хирагану"
              />
            </li>
          </ul>
          <ul className={styles.dashboard__lists}>
            <li className={styles.dashboard__list}>
              <LinkButton href="/kanji/repeat" text="Учим кандзи" />
            </li>
          </ul>
          <ul className={styles.dashboard__lists}>
            <li className={styles.dashboard__list}>
              <LinkButton href="/words/repeat" text="Учим слова" />
            </li>
          </ul>
        </Accordion>

        <Accordion header="Добавить карточки">
          <ul className={styles.dashboard__lists}>
            <li className={styles.dashboard__list}>
              <LinkButton href="/kanji/add" text="Добавить кандзи" />
            </li>
          </ul>
          <ul className={styles.dashboard__lists}>
            <li className={styles.dashboard__list}>
              <LinkButton href="/words/add" text="Добавить слово" />
            </li>
          </ul>
        </Accordion>

        <Accordion header="Ваша библиотека">
          <ul className={styles.dashboard__lists}>
            <li className={styles.dashboard__list}>
              <LinkButton href="/tables/table-kana" text="Таблица азбук" />
            </li>
          </ul>
          <ul className={styles.dashboard__lists}>
            <li className={styles.dashboard__list}>
              <LinkButton href="/tables/table-kanji" text="Все кандзи" />
            </li>
          </ul>
          <ul className={styles.dashboard__lists}>
            <li className={styles.dashboard__list}>
              <LinkButton href="/tables/table-words" text="Все слова" />
            </li>
          </ul>
        </Accordion>
      </div>

      <LinkButton href="/profile" text="Профиль" />
    </section>
  );
}
