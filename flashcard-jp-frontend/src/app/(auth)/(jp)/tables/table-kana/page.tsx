import styles from "./tableKana.module.scss";
import KanaTable from "@/_components/KanaTable/KanaTable";
import { getHirakana, getKatakana } from "@/_utils/server/kanaApi";

export default async function Page() {
  const [hiragana, katakana] = await Promise.all([
    getHirakana(),
    getKatakana(),
  ]);

  return (
    <section className={styles.tableKana}>
      <KanaTable hiragana={hiragana} katakana={katakana} />
    </section>
  );
}
