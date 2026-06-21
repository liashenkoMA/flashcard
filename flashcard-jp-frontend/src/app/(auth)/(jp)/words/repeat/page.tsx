import styles from "./wordsRepeat.module.scss";
import WordsRepeatPageComponent from "@/_components/WordsRepeatPageComponent/WordsRepeatPageComponents";
import { IWord } from "@/_interface/Interface";
import { getWord } from "@/_utils/api/server/wordApi";
import buildWeightedDeck from "@/_utils/buildWeightedDeck";

export default async function WordsRepeat() {
  const data: IWord[] = await getWord();

  const preparedWords = buildWeightedDeck(data);

  return (
    <section className={styles.wordsrepeat}>
      <WordsRepeatPageComponent words={preparedWords} />
    </section>
  );
}
