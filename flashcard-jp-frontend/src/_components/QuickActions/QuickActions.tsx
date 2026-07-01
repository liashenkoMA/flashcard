import styles from "./quickActions.module.scss";
import { ROUTES } from "@/_constants/routes.constant";
import LinkButton from "../UI/LinkButton/LinkButton";

export default function QuickActions() {
  return (
    <section className={styles.quickActions}>
      <h2 className={styles.quickActions__title}>Быстрые действия</h2>
      <ul className={styles.quickActions__lists}>
        <li className={styles.quickActions__list}>
          <LinkButton href={ROUTES.kanji.study} text="Учить кандзи" />
        </li>
        <li className={styles.quickActions__list}>
          <LinkButton href={ROUTES.words.study} text="Учить слова" />
        </li>
      </ul>
    </section>
  );
}
