import styles from "./repeatHanzi.module.scss";
import HanziRepeatPageComponent from "@/_components/HanziRepeatPageComponent/HanziRepeatPageComponent";
import { IHanzi } from "@/_interface/Interface";
import { getHanzi } from "@/_utils/api/server/hanziApi";
import buildWeightedDeck from "@/_utils/buildWeightedDeck";

export default async function HanziRepeat() {
  const data: IHanzi[] = await getHanzi();

  const preparedHanzi = buildWeightedDeck(data);

  return (
    <section className={styles.hanzirepeat}>
      <HanziRepeatPageComponent hanzi={preparedHanzi} />
    </section>
  );
}
