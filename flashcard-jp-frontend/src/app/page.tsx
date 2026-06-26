import styles from "./page.module.scss";
import AuthModal from "@/_components/AuthModal/AuthModal";
import Faq from "@/_components/FAQ/Faq";

export default function Page() {
  return (
    <div className={styles.wrapper}>
      <main className={styles.content}>
        <section className={styles.content__header}>
          <p className={styles.text}>
            Контент разбить по секциям, т.е. смысловым блокам. Сверстать
            полноценный SPA
          </p>
        </section>
        <Faq />
        <AuthModal />
      </main>
    </div>
  );
}
