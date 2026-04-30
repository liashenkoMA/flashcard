import styles from "./kana.module.scss";
import KanaPageComponent from "@/_components/KanaPageComponent/KanaPageComponent";

export default async function Page() {
  return (
    <section className={styles.kana}>
      <KanaPageComponent />
    </section>
  );
}
