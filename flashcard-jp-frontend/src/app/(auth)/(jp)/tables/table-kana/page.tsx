import styles from "./tableKana.module.scss";
import KanaTable from "@/_components/KanaTable/KanaTable";
import { getHiragana, getKatakana } from "@/_utils/api/server/kanaApi";

export default async function Page() {
  const [hiragana, katakana] = await Promise.all([
    getHiragana(),
    getKatakana(),
  ]);

  return (
    <section className={styles.tableKana}>
      <KanaTable hiragana={hiragana} katakana={katakana} />
    </section>
  );
}
