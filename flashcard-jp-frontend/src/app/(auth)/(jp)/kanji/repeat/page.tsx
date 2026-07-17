import styles from "./kanjiRepeat.module.scss";
import { IKanji } from "@/_interface/Interface";
import KandjiRepeatPageComponent from "@/_components/KandjiRepeatPageComponent/KandjiRepeatPageComponent";
import { getKanji } from "@/_utils/api/server/kanjiApi";
import buildWeightedDeck from "@/_utils/buildWeightedDeck";

export default async function KandziRepeat() {
  const data: IKanji[] = await getKanji();

  const preparedKanji = buildWeightedDeck(data);

  return (
    <section className={styles.kanjirepeat}>
      <KandjiRepeatPageComponent kanji={preparedKanji} />
    </section>
  );
}
