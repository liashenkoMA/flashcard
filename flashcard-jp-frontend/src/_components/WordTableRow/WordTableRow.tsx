import styles from "./wordTableRow.module.scss";
import { IWord } from "@/_interface/Interface";
import TableButton from "../UI/TableButton/TableButton";

export default function wordTableRow({
  word,
  deleteword,
}: {
  word: IWord;
  deleteword: () => void;
}) {
  return (
    <li className={styles.wordtablerow}>
      <div className={styles.wordtablerow__content}>
        <p className={styles.wordtablerow__symbol}>{word.word}</p>
        <p className={`${styles.wordtablerow__reading}`}>{word.translate}</p>
      </div>

      <TableButton learned={true} onClick={deleteword} />
    </li>
  );
}
