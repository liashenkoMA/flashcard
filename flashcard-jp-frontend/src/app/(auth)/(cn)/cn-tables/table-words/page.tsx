import ButtonUp from "@/_components/ButtonUp/ButtonUp";
import styles from "./tablecnwords.module.scss";
import { ICnWord } from "@/_interface/Interface";
import { getCnWord } from "@/_utils/api/server/cnWordsApi";
import CnWordsTable from "@/_components/CnWordTable/CnWordsTable";

export default async function Page() {
  const data: ICnWord[] = await getCnWord();

  return (
    <>
      <section className={styles.tablecnwords}>
        <CnWordsTable words={data} />
      </section>
      <ButtonUp />
    </>
  );
}
