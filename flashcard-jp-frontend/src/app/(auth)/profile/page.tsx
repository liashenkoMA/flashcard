import styles from "./profile.module.scss";
import ProfileForm from "@/_components/ProfileForm/ProfileForm";

export default function Page() {
  return (
    <section className={styles.profile}>
      <h1 className={styles.profile__title}>Профиль</h1>
      <ProfileForm />
    </section>
  );
}
