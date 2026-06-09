import styles from "./addWords.module.scss";
import AddWordForm from "@/_components/AddWordForm/AddWordForm";

export default async function Page() {
  return (
    <section className={styles.addword}>
      <h1 className={styles.addword__title}>Добавьте слово</h1>
      <AddWordForm />
    </section>
  );
}
