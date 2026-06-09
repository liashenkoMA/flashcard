import styles from "./wordsRepeat.module.scss";
import WordsRepeatPageComponent from "@/_components/WordsRepeatPageComponent/WordsRepeatPageComponents";
import { IWord } from "@/_interface/Interface";
import { getWord } from "@/_utils/api/server/wordApi";

export default async function WordsRepeat() {
  const data: IWord[] = await getWord();

  return (
    <section className={styles.wordsrepeat}>
      <WordsRepeatPageComponent words={data} />
    </section>
  );
}
