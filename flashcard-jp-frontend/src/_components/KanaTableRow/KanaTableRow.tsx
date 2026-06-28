import styles from "./kanaTableRow.module.scss";
import TableButton from "../UI/TableButton/TableButton";
import { IKana } from "@/_interface/Interface";

export default function KanaTableRow({
  kana,
  updateKana,
}: {
  kana: IKana;
  updateKana: () => void;
}) {
  return (
    <li className={styles.kanatablerow}>
      <p className={styles.kanatablerow__symbol}>{kana.symbol}</p>
      <p className={styles.kanatablerow__reading}>{kana.romaji}</p>
      <TableButton
        learned={kana.learned ?? false}
        onClick={updateKana}
      />
    </li>
  );
}
