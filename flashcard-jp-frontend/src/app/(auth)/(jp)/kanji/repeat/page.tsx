import styles from "./kanjiRepeat.module.scss";
import { IKanji } from "@/_interface/Interface";
import KandjiRepeatPageComponent from "@/_components/KandjiRepeatPageComponent/KandjiRepeatPageComponent";
import { getKanji } from "@/_utils/api/server/kanjiApi";

export default async function KandziRepeat() {
  const data: IKanji[] = await getKanji();

  return (
    <section className={styles.kandjirepeat}>
      <KandjiRepeatPageComponent kanji={data} />
    </section>
  );
}
