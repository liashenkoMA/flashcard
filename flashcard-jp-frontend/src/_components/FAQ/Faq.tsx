import styles from "./faq.module.scss";
import { FAQ } from "@/_constants/faq.constant";
import Accordion from "../UI/Accordion/Accordion";

export default function Faq() {
  return (
    <section className={styles.faq}>
      <div className={styles.faq__header}>
        <span className={styles.faq__span}>FAQ</span>
        <h2 className={styles.faq__title}>Часто задаваемые вопросы</h2>
        <p className={`${styles.faq__text} ${styles.faq__text_subtitle}`}>
          Коротко о главном — всё, что важно знать перед стартом
        </p>
      </div>
      <div className={styles.faq__content}>
        {FAQ.map((el) => (
          <Accordion header={el.header} key={el.header}>
            <p className={`${styles.faq__text} ${styles.faq__text_accordion}`}>
              {el.text}
            </p>
          </Accordion>
        ))}
      </div>
    </section>
  );
}
