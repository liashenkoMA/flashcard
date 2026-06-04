import styles from "./kanjiTableRow.module.scss";
import { IKanji } from "@/_interface/Interface";
import TableButton from "../UI/TableButton/TableButton";

export default function KanjiTableRow({
  kanji,
  deleteKanji,
}: {
  kanji: IKanji;
  deleteKanji: () => void;
}) {
  return (
    <li className={styles.kanjitablerow}>
      <p className={styles.kanjitablerow__symbol}>{kanji.kanji}</p>
      <div className={styles.kanjitablerow__readings}>
        <p
          className={`${styles.kanjitablerow__reading} ${styles.kanjitablerow__reading_type_jpread}`}
        >
          {kanji.jpRead}
        </p>
        <p
          className={`${styles.kanjitablerow__reading} ${styles.kanjitablerow__reading_type_chread}`}
        >
          {kanji.chinaRead}
        </p>
      </div>

      <p
        className={`${styles.kanjitablerow__reading} ${styles.kanjitablerow__reading_type_translate}`}
      >
        {kanji.translate}
      </p>
      <TableButton learned={true} onClick={deleteKanji} />
    </li>
  );
}
