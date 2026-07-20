import styles from "./contacts.module.scss";
import ContactForm from "@/_components/ContactForm/ContactForm";

export default function Page() {
  return (
    <section className={styles.contacts}>
      <div className={styles.contacts__content}>
        <h1 className={styles.contacts__title}>Контакты</h1>
        <p className={styles.contacts__text}>
          Если у Вас возникли вопросы, предложения, проблемы с использованием
          нашего сервиса, отправьте ваше сообщение в форме ниже. Мы обязательно
          ответим Вам!
        </p>
      </div>
      <ContactForm />
    </section>
  );
}
