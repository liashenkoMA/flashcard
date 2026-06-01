import styles from "./kandziRepeat.module.scss";
import { IKandji } from "@/_interface/Interface";
import KandjiRepeatPageComponent from "@/_components/KandjiRepeatPageComponent/KandjiRepeatPageComponent";
import { getKanji } from "@/_utils/api/server/kanjiApi";

export default async function KandziRepeat() {
  const kanji: IKandji[] = await getKanji();

  return (
    <section className={styles.kandzirepeat}>
      <KandjiRepeatPageComponent kanji={kanji} />
    </section>
  );
}
