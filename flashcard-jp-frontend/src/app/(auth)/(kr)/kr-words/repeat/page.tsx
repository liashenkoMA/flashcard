import styles from "./krWordsRepeat.module.scss";
import KrWordsRepeatPageComponent from "@/_components/KrWordsRepeatPageComponent/KrWordsRepeatPageComponent";
import { IWord } from "@/_interface/Interface";
import { getKrWord } from "@/_utils/api/server/krWordApi";
import buildWeightedDeck from "@/_utils/buildWeightedDeck";


export default async function KrWordsRepeat() {
  const data: IWord[] = await getKrWord();

  const preparedWords = buildWeightedDeck(data);

  return (
    <section className={styles.krwordsrepeat}>
      <KrWordsRepeatPageComponent words={preparedWords} />
    </section>
  );
}
