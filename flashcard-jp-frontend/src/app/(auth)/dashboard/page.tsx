import styles from "./dashboard.module.scss";
import Accordion from "@/_components/UI/Accordion/Accordion";
import LinkButton from "@/_components/UI/LinkButton/LinkButton";
import Greeting from "@/_components/Greeting/Greeting";
import { ROUTES } from "@/_constants/routes.constant";
import QuickActions from "@/_components/QuickActions/QuickActions";

export default function Page() {
  return (
    <section className={styles.dashboard}>
      <Greeting />
      <QuickActions />

      <div className={styles.dashboard__section}>
        <h2 className={styles.dashboard__section_title}>Японский язык</h2>
        <Accordion header="Хирагана">
          <ul className={styles.dashboard__lists}>
            <li className={styles.dashboard__list}>
              <LinkButton
                href={ROUTES.kana.hiragana.learn}
                text="Изучить хирагану"
              />
            </li>
            <li className={styles.dashboard__list}>
              <LinkButton
                href={ROUTES.kana.hiragana.repeat}
                text="Повторить хирагану"
              />
            </li>
          </ul>
        </Accordion>

        <Accordion header="Катакана">
          <ul className={styles.dashboard__lists}>
            <li className={styles.dashboard__list}>
              <LinkButton
                href={ROUTES.kana.katakana.learn}
                text="Изучить катакану"
              />
            </li>
            <li className={styles.dashboard__list}>
              <LinkButton
                href={ROUTES.kana.katakana.repeat}
                text="Повторить катакану"
              />
            </li>
          </ul>
        </Accordion>

        <Accordion header="Кандзи">
          <ul className={styles.dashboard__lists}>
            <li className={styles.dashboard__list}>
              <LinkButton href={ROUTES.kanji.study} text="Учить кандзи" />
            </li>
            <li className={styles.dashboard__list}>
              <LinkButton href={ROUTES.kanji.add} text="Добавить кандзи" />
            </li>
          </ul>
        </Accordion>

        <Accordion header="Слова">
          <ul className={styles.dashboard__lists}>
            <li className={styles.dashboard__list}>
              <LinkButton href={ROUTES.words.study} text="Учить слова" />
            </li>
            <li className={styles.dashboard__list}>
              <LinkButton href={ROUTES.words.add} text="Добавить слово" />
            </li>
          </ul>
        </Accordion>

        <Accordion header="Ваша библиотека">
          <ul className={styles.dashboard__lists}>
            <li className={styles.dashboard__list}>
              <LinkButton href={ROUTES.tables.kana} text="Таблица азбук" />
            </li>
          </ul>

          <ul className={styles.dashboard__lists}>
            <li className={styles.dashboard__list}>
              <LinkButton href={ROUTES.tables.kanji} text="Все кандзи" />
            </li>
          </ul>

          <ul className={styles.dashboard__lists}>
            <li className={styles.dashboard__list}>
              <LinkButton href={ROUTES.tables.words} text="Все слова" />
            </li>
          </ul>
        </Accordion>
      </div>

      <div className={styles.dashboard__section}>
        <h2 className={styles.dashboard__section_title}>Корейский язык</h2>
        <Accordion header="Хангуел">
          <ul className={styles.dashboard__lists}>
            <li className={styles.dashboard__list}>
              <LinkButton href={ROUTES.hangeul.learn} text="Изучить хангуел" />
            </li>
            <li className={styles.dashboard__list}>
              <LinkButton
                href={ROUTES.hangeul.repeat}
                text="Повторить хангуел"
              />
            </li>
          </ul>
        </Accordion>

        <Accordion header="Слова">
          <ul className={styles.dashboard__lists}>
            <li className={styles.dashboard__list}>
              <LinkButton href={ROUTES.kr_words.study} text="Учить слова" />
            </li>
            <li className={styles.dashboard__list}>
              <LinkButton href={ROUTES.kr_words.add} text="Добавить слово" />
            </li>
          </ul>
        </Accordion>

        <Accordion header="Ваша библиотека">
          <ul className={styles.dashboard__lists}>
            <li className={styles.dashboard__list}>
              <LinkButton href={ROUTES.kr_tables.hangeul} text="Все хангуел" />
            </li>
          </ul>

          <ul className={styles.dashboard__lists}>
            <li className={styles.dashboard__list}>
              <LinkButton href={ROUTES.kr_tables.words} text="Все слова" />
            </li>
          </ul>
        </Accordion>
      </div>

      <div className={styles.dashboard__section}>
        <h2 className={styles.dashboard__section_title}>Китайский язык</h2>
        <Accordion header="Ханзи">
          <ul className={styles.dashboard__lists}>
            <li className={styles.dashboard__list}>
              <LinkButton href={ROUTES.hanzi.add} text="Добавить ханзи" />
            </li>
            <li className={styles.dashboard__list}>
              <LinkButton href={ROUTES.hanzi.study} text="Учить ханзи" />
            </li>
          </ul>
        </Accordion>

        <Accordion header="Слова">
          <ul className={styles.dashboard__lists}>
            <li className={styles.dashboard__list}>
              <LinkButton href={ROUTES.cn_words.study} text="Учить слова" />
            </li>
            <li className={styles.dashboard__list}>
              <LinkButton href={ROUTES.cn_words.add} text="Добавить слово" />
            </li>
          </ul>
        </Accordion>

        <Accordion header="Ваша библиотека">
          <ul className={styles.dashboard__lists}>
            <li className={styles.dashboard__list}>
              <LinkButton href={ROUTES.cn_tables.hanzi} text="Все ханзи" />
            </li>
          </ul>

          <ul className={styles.dashboard__lists}>
            <li className={styles.dashboard__list}>
              <LinkButton href={ROUTES.cn_tables.words} text="Все слова" />
            </li>
          </ul>
        </Accordion>
      </div>

      <LinkButton href={ROUTES.profile} text="Профиль" />
      <LinkButton href={ROUTES.contacts} text="Контакты" />
    </section>
  );
}
