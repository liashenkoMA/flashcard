import styles from "./dashboard.module.scss";
import LinkButton from "@/_components/UI/LinkButton/LinkButton";

export default function Page() {
  return (
    <section className={styles.dashboard}>
      <h1 className={styles.dashboard__title}>Dashboard</h1>
      <div className={styles.dashboard__section}>
        <h2 className={styles.dashboard__subtitle}>Азбуки</h2>
        <LinkButton href="/kana" text="Изучить катакану" />
        <LinkButton href="/kana" text="Повторить изученное" />
        <LinkButton href="/kana" text="Вся катакана" />

        <LinkButton href="#" text="Изучить хирагану" />
        <LinkButton href="#" text="Повторть изученное" />
        <LinkButton href="#" text="Вся хирагана" />
      </div>

      <LinkButton href="/profile" text="Профиль" />
    </section>
  );
}
