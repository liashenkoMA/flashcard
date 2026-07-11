import { getHangeul } from "@/_utils/api/server/hangeulApi";
import styles from "./tablehangeul.module.scss";
import ButtonUp from "@/_components/ButtonUp/ButtonUp";
import HangeulTable from "@/_components/HangeulTable/HangeulTable";

export default async function Page() {
  const hangeul = await getHangeul();

  return (
    <>
      <section className={styles.tableHangeul}>
        <HangeulTable hangeul={hangeul} />
      </section>
      <ButtonUp />
    </>
  );
}
