import styles from "./hanzitablerow.module.scss";
import { IHanzi } from "@/_interface/Interface";
import TableButton from "../UI/TableButton/TableButton";

export default function HanziTableRow({
  hanzi,
  deleteHanzi,
}: {
  hanzi: IHanzi;
  deleteHanzi: () => void;
}) {
  return (
    <li className={styles.hanzitablerow}>
      <p className={styles.hanzitablerow__symbol}>{hanzi.hanzi}</p>
      <div className={styles.hanzitablerow__readings}>
        <p
          className={`${styles.hanzitablerow__reading} ${styles.hanzitablerow__reading_type_category}`}
        >
          {hanzi.category}
        </p>
        <p
          className={`${styles.hanzitablerow__reading} ${styles.hanzitablerow__reading_type_chread}`}
        >
          {hanzi.pinyin}
        </p>
      </div>

      <p
        className={`${styles.hanzitablerow__reading} ${styles.hanzitablerow__reading_type_translate}`}
      >
        {hanzi.translate}
      </p>
      <TableButton learned={true} onClick={deleteHanzi} />
    </li>
  );
}
