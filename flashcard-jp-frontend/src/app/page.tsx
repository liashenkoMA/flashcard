import styles from "./page.module.scss";
import AuthModal from "@/_components/AuthModal/AuthModal";
import Faq from "@/_components/FAQ/Faq";
import Introduction from "@/_components/Introduction/Introduction";
import PageHero from "@/_components/PageHero/PageHero";
import Reviews from "@/_components/Reviews/Reviews";
import CTA from "@/_components/CTA/Cta";
import ButtonUp from "@/_components/ButtonUp/ButtonUp";

export default function Page() {
  return (
    <div className={styles.wrapper}>
      <main className={styles.content}>
        <PageHero />
        <Introduction />
        <Reviews />
        <Faq />
        <CTA />
        <AuthModal />
        <ButtonUp />
      </main>
    </div>
  );
}
