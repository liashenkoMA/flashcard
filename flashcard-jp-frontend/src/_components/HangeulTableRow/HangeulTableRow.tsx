import styles from "./hangeulTableRow.module.scss";
import TableButton from "../UI/TableButton/TableButton";
import { IHangeul } from "@/_interface/Interface";

export default function HangeulTableRow({
  hangeul,
  updateHangeul,
}: {
  hangeul: IHangeul;
  updateHangeul: () => void;
}) {
  return (
    <li className={styles.hangeultablerow}>
      <p className={styles.hangeultablerow__symbol}>{hangeul.symbol}</p>
      <p className={styles.hangeultablerow__reading}>{hangeul.romaji}</p>
      <TableButton learned={hangeul.learned ?? false} onClick={updateHangeul} />
    </li>
  );
}
