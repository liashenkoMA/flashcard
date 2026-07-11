import styles from "./addKrWords.module.scss";
import AddKrWordForm from "@/_components/AddKrWordForm/AddKrWordForm";

export default async function Page() {
  return (
    <section className={styles.addkrword}>
      <h1 className={styles.addkrword__title}>Добавьте слово</h1>
      <AddKrWordForm />
    </section>
  );
}
