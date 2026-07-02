import styles from "./sessionProgress.module.scss";

export default function SessionProgress({
  length,
  answeredCount,
}: {
  length: number;
  answeredCount: number;
}) {
  const progress = length === 0 ? 0 : answeredCount / length;

  return (
    <div className={styles.sessionProgress}>
      <div className={styles.sessionProgress__bar}>
        <div
          className={styles.sessionProgress__fill}
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <p className={styles.sessionProgress__cards}>
        {answeredCount}/{length}
      </p>
    </div>
  );
}
