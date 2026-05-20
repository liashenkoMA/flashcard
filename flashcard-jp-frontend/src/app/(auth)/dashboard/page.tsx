import Accordion from "@/_components/UI/Accordion/Accordion";
import styles from "./dashboard.module.scss";
import LinkButton from "@/_components/UI/LinkButton/LinkButton";

export default function Page() {
  return (
    <section className={styles.dashboard}>
      <h1 className={styles.dashboard__title}>Dashboard</h1>
      <div className={styles.dashboard__section}>
        <Accordion header="Катакана">
          <LinkButton href="/kana" text="Изучить катакану" />
          <LinkButton href="/kana" text="Повторить изученное" />
          <LinkButton href="/kana" text="Вся катакана" />
        </Accordion>

        <Accordion header="Хирагана">
          <LinkButton href="#" text="Изучить хирагану" />
          <LinkButton href="#" text="Повторть изученное" />
          <LinkButton href="#" text="Вся хирагана" />
        </Accordion>
      </div>

      <LinkButton href="/profile" text="Профиль" />
    </section>
  );
}
