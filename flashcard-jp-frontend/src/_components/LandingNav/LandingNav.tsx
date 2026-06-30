"use client";

import LinkButton from "../UI/LinkButton/LinkButton";
import styles from "./landingnav.module.scss";
import { usePathname } from "next/navigation";

export default function LandingNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (!isHome) return null;

  return (
    <nav className={styles.landingnav}>
      <ul className={styles.landingnav__lists}>
        <li className={styles.landingnav__list}>
          <LinkButton href="#introduction" text="О проекте" />
        </li>
        <li>
          <LinkButton href="#reviews" text="Отзывы" />
        </li>
        <li>
          <LinkButton href="#faq" text="FAQ" />
        </li>
      </ul>
    </nav>
  );
}
