import styles from "./logo.module.scss";
import Link from "next/link";
import Image from "next/image";

import logo from "@_images/logo.png";

export default function Logo() {
  return (
    <div className={styles.logo}>
      <Link href="/" className={styles.logo__link}>
        <Image
          src={logo}
          width={80}
          height={80}
          alt="Logo"
          className={styles.logo__image}
        />
      </Link>
      <p className={styles.logo__text}>Memora</p>
    </div>
  );
}
