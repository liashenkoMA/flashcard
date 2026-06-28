import styles from "./reviewsCard.module.scss";
import { IReview } from "@/_interface/Interface";

export default function ReviewsCard({ card }: { card: IReview }) {
  return (
    <div className={styles.reviews__card}>
      <div className={styles.reviews__card_top}>
        <div className={styles.reviews__card_icon}></div>
        <p
          className={`${styles.reviews__card_text} ${styles.reviews__card_message}`}
        >
          {card.message}
        </p>
      </div>

      <div className={styles.reviews__card_profile}>
        <p
          className={`${styles.reviews__card_text} ${styles.reviews__card_user}`}
        >
          {card.user}
        </p>
        <p
          className={`${styles.reviews__card_text} ${styles.reviews__card_learned}`}
        >
          {card.learned}
        </p>
      </div>
    </div>
  );
}
