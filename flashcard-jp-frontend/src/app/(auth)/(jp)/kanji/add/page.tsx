import styles from "./addKanji.module.scss";
import AddKanjiForm from "@/_components/AddKanjiForm/AddKanjiForm";

export default async function Page() {
  return (
    <section className={styles.addkanji}>
      <h1 className={styles.addkanji__title}>Добавьте ваши кандзи</h1>
      <AddKanjiForm />
    </section>
  );
}
