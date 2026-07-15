import styles from "./addCnWords.module.scss";
import AddCnWordForm from "@/_components/AddCnWordForm/AddCnWordForm";

export default async function Page() {
  return (
    <section className={styles.addcnword}>
      <h1 className={styles.addcnword__title}>Добавьте слово</h1>
      <AddCnWordForm />
    </section>
  );
}
