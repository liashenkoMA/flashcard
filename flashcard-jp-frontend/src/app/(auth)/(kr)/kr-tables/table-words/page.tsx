import styles from "./krTableWords.module.scss";
import ButtonUp from "@/_components/ButtonUp/ButtonUp";
import KrWordTable from "@/_components/KrWordTable/KrWordTable";
import { IWord } from "@/_interface/Interface";
import { getKrWord } from "@/_utils/api/server/krWordApi";


export default async function Page() {
  const data: IWord[] = await getKrWord();

  return (
    <>
      <section className={styles.krtablewords}>
        <KrWordTable words={data} />
      </section>
      <ButtonUp />
    </>
  );
}
