import KanjiTable from "@/_components/KanjiTable/KanjiTable";
import styles from "./tableKanji.module.scss";
import { getKanji } from "@/_utils/api/server/kanjiApi";
import { IKanji } from "@/_interface/Interface";

export default async function Page() {
  const data: IKanji[] = await getKanji();

  return (
    <section className={styles.tablekanji}>
      <KanjiTable kanji={data} />
    </section>
  );
}
