import styles from "./dashboard.module.scss";
import Accordion from "@/_components/UI/Accordion/Accordion";
import LinkButton from "@/_components/UI/LinkButton/LinkButton";

export default function Page() {
  return (
    <section className={styles.dashboard}>
      <h1 className={styles.dashboard__title}>Личный кабинет</h1>
      <div className={styles.dashboard__section}>
        <Accordion header="Катакана">
          <LinkButton href="/kana/katakana" text="Изучить катакану" />
          <LinkButton
            href="/kana/katakana?type=repeat"
            text="Повторить изученное"
          />
          <LinkButton href="/tables/table-kana" text="Вся катакана" />
        </Accordion>

        <Accordion header="Хирагана">
          <LinkButton href="/kana/hiragana" text="Изучить хирагану" />
          <LinkButton
            href="/kana/hiragana?type=repeat"
            text="Повторить изученное"
          />
          <LinkButton href="/tables/table-kana" text="Вся хирагана" />
        </Accordion>

        <Accordion header="Кандзи">
          <LinkButton href="/kanji/add" text="Добавить кандзи" />
          <LinkButton href="/kanji/repeat" text="Учим кандзи" />
          <LinkButton href="/tables/table-kanji" text="Все кандзи" />
        </Accordion>

        <Accordion header="Слова">
          <LinkButton href="/words/add" text="Добавить слово" />
          <LinkButton href="/words/repeat" text="Учим слова" />
          <LinkButton href="/tables/table-words" text="Все слова" />
        </Accordion>
      </div>

      <LinkButton href="/profile" text="Профиль" />
    </section>
  );
}
