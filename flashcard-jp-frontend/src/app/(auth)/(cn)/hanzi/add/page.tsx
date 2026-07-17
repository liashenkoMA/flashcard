import styles from "./addHanzi.module.scss";
import AddHanziForm from "@/_components/AddHanziForm/AddHanziForm";

export default async function Page() {
  return (
    <section className={styles.addhanzi}>
      <h1 className={styles.addhanzi__title}>Добавьте ваши ханзи</h1>
      <AddHanziForm />
    </section>
  );
}
