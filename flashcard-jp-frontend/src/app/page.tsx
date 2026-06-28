import styles from "./page.module.scss";
import AuthModal from "@/_components/AuthModal/AuthModal";
import Faq from "@/_components/FAQ/Faq";
import PageHeader from "@/_components/PageHeader/PageHeader";
import Reviews from "@/_components/Reviews/Reviews";

export default function Page() {
  return (
    <div className={styles.wrapper}>
      <main className={styles.content}>
        <PageHeader />
        <Reviews />
        <Faq />
        <AuthModal />
      </main>
    </div>
  );
}
