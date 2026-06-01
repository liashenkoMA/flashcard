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
          <LinkButton href="/kana/hirakana" text="Изучить хирагану" />
          <LinkButton
            href="/kana/hirakana?type=repeat"
            text="Повторить изученное"
          />
          <LinkButton href="/tables/table-kana" text="Вся хирагана" />
        </Accordion>

        <Accordion header="Кандзи">
          <LinkButton href="/kandzi/add" text="Добавить кандзи" />
          <LinkButton
            href="/kandzi/repeat"
            text="Учим кандзи"
          />
          <LinkButton href="/tables/kandzi" text="Все кандзи" />
        </Accordion>
      </div>

      <LinkButton href="/profile" text="Профиль" />
    </section>
  );
}
