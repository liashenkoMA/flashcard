import styles from "./cnWordsTableRow.module.scss";
import TableButton from "../UI/TableButton/TableButton";
import { ICnWord } from "@/_interface/Interface";

export default function CnWordTableRow({
  word,
  deleteWord,
}: {
  word: ICnWord;
  deleteWord: () => void;
}) {
  return (
    <li className={styles.cnwordtablerow}>
      <p className={styles.cnwordtablerow__symbol}>{word.word}</p>
      <div className={styles.cnwordtablerow__readings}>
        <p
          className={`${styles.cnwordtablerow__reading} ${styles.cnwordtablerow__reading_type_category}`}
        >
          {word.category}
        </p>
        <p
          className={`${styles.cnwordtablerow__reading} ${styles.cnwordtablerow__reading_type_chread}`}
        >
          {word.pinyin}
        </p>
      </div>

      <p
        className={`${styles.cnwordtablerow__reading} ${styles.cnwordtablerow__reading_type_translate}`}
      >
        {word.translate}
      </p>
      <TableButton learned={true} onClick={deleteWord} />
    </li>
  );
}
