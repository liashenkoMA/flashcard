import styles from "./not-found.module.scss";
import Button from "@/_components/UI/Button/Button";

export default function NotFound() {
  return (
    <div className={styles.wrapper}>
      <main className={styles.content}>
        <section className={styles.notfound}>
          <div className={styles.notfound__image}></div>
          <div className={styles.notfound__content}>
            <p
              className={`${styles.notfound__text} ${styles.notfound__errorcode}`}
            >
              404
            </p>
            <h2 className={styles.notfound__header}>Not Found</h2>
            <p
              className={`${styles.notfound__text}`}
            >
              Страница не найдена или еще не создана. Пожалуйста, вернитесь на
              главную.
            </p>
            <Button>Главная</Button>
          </div>
        </section>
      </main>
    </div>
  );
}
