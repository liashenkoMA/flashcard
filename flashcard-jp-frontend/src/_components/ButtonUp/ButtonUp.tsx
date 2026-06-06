"use client";

import styles from "./buttonUp.module.scss";
import { useEffect, useState } from "react";

export default function ButtonUp() {
  const [hide, setHide] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 600) {
        setHide(false);
      } else {
        setHide(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleSkrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <button
      type="button"
      className={`${styles.buttonup__button} ${hide ? styles.buttonup__button_type_hide : ""}`}
      onClick={handleSkrollToTop}
    ></button>
  );
}
