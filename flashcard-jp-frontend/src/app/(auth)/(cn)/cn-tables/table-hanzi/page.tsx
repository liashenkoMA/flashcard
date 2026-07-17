import styles from "./tablehanzi.module.scss";
import { IHanzi } from "@/_interface/Interface";
import { getHanzi } from "@/_utils/api/server/hanziApi";
import ButtonUp from "@/_components/ButtonUp/ButtonUp";
import HanziTable from "@/_components/HanziTable/HanziTable";

export default async function Page() {
  const data: IHanzi[] = await getHanzi();

  return (
    <>
      <section className={styles.tablekanji}>
        <HanziTable hanzi={data} />
      </section>
      <ButtonUp />
    </>
  );
}
