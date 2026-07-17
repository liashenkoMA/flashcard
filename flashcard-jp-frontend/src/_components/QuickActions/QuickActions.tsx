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
          <LinkButton href={ROUTES.words.study} text="Учить японские слова" />
        </li>
        <li className={styles.quickActions__list}>
          <LinkButton
            href={ROUTES.kr_words.study}
            text="Учить корейские слова"
          />
        </li>
        <li className={styles.quickActions__list}>
          <LinkButton
            href={ROUTES.cn_words.study}
            text="Учить китайские слова"
          />
        </li>
        <li className={styles.quickActions__list}>
          <LinkButton
            href={ROUTES.hanzi.study}
            text="Учить ханзи"
          />
        </li>
      </ul>
    </section>
  );
}
