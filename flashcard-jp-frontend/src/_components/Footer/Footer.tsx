import styles from "./footer.module.scss";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer__content}>
        <p className={styles.footer__copyright}>
          © 2025 Created by
          <Link href="#" className={styles.footer__copyright_link}>
            {" "}
            LyashenkoMA
          </Link>
        </p>
      </div>
    </footer>
  );
}
