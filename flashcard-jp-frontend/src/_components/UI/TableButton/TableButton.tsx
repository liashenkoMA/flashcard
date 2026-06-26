import styles from "./TableButton.module.scss";

export default function TableButton({
  learned,
  onClick,
}: {
  learned: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={learned ? "Удалить" : "Выучить"}
      className={`${styles.tablebutton} ${learned === true ? styles.tablebutton__delete : styles.tablebutton__learn}`}
    >
      {learned === true ? "" : "Выучить"}
    </button>
  );
}
