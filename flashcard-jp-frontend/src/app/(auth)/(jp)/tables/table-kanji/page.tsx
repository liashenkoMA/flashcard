import styles from "./tableKanji.module.scss";
import KanjiTable from "@/_components/KanjiTable/KanjiTable";
import { getKanji } from "@/_utils/api/server/kanjiApi";
import { IKanji } from "@/_interface/Interface";
import ButtonUp from "@/_components/ButtonUp/ButtonUp";

export default async function Page() {
  const data: IKanji[] = await getKanji();

  return (
    <>
      <section className={styles.tablekanji}>
        <KanjiTable kanji={data} />
      </section>
      <ButtonUp />
    </>
  );
}
