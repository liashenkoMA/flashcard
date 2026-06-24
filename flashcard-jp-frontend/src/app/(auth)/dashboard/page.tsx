import styles from "./dashboard.module.scss";
import Accordion from "@/_components/UI/Accordion/Accordion";
import LinkButton from "@/_components/UI/LinkButton/LinkButton";

export default function Page() {
  return (
    <section className={styles.dashboard}>
      <h1 className={styles.dashboard__title}>Главная</h1>

      <div className={styles.dashboard__section}>
        <Accordion header="Учить">
          <LinkButton href="/kana/katakana" text="Изучить катакану" />
          <LinkButton
            href="/kana/katakana?type=repeat"
            text="Повторить катакану"
          />

          <LinkButton href="/kana/hiragana" text="Изучить хирагану" />
          <LinkButton
            href="/kana/hiragana?type=repeat"
            text="Повторить хирагану"
          />

          <LinkButton href="/kanji/repeat" text="Учим кандзи" />
          <LinkButton href="/words/repeat" text="Учим слова" />
        </Accordion>

        <Accordion header="Добавить карточки">
          <LinkButton href="/kanji/add" text="Добавить кандзи" />
          <LinkButton href="/words/add" text="Добавить слово" />
        </Accordion>

        <Accordion header="Ваша библиотека">
          <LinkButton href="/tables/table-kana" text="Таблица азбук" />
          <LinkButton href="/tables/table-kanji" text="Все кандзи" />
          <LinkButton href="/tables/table-words" text="Все слова" />
        </Accordion>
      </div>

      <LinkButton href="/profile" text="Профиль" />
    </section>
  );
}
