import WordTable from "@/_components/WordsTable/WordsTable";
import styles from "./tableWords.module.scss";
import { getWord } from "@/_utils/api/server/wordApi";
import { IWord } from "@/_interface/Interface";
import ButtonUp from "@/_components/ButtonUp/ButtonUp";

export default async function Page() {
  const data: IWord[] = await getWord();

  return (
    <>
      <section className={styles.tablewords}>
        <WordTable words={data} />
      </section>
      <ButtonUp />
    </>
  );
}
