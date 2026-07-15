import styles from "./cnWordsRepeat.module.scss";
import { getCnWord } from "@/_utils/api/server/cnWordsApi";
import { ICnWord } from "@/_interface/Interface";
import buildWeightedDeck from "@/_utils/buildWeightedDeck";
import CnWordsRepeatPageComponent from "@/_components/CnWordsRepeatPageComponent/CnWordsRepeanPageComponent";

export default async function CnWordsRepeat() {
  const data: ICnWord[] = await getCnWord();

  const preparedWords = buildWeightedDeck(data);

  return (
    <section className={styles.cnwordsrepeat}>
      <CnWordsRepeatPageComponent words={preparedWords} />
    </section>
  );
}
