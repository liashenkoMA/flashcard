"use client";

import styles from "./ProfileDropdown.module.scss";
import Image from "next/image";
import avatar from "../../_images/avatar.png";
import { useState } from "react";
import Button from "../UI/Button/Button";
import { useRouter } from "next/navigation";
import { logout } from "@/_utils/api/server/authApi";
import { logout as logoutAction } from "@/_store/authSlice";
import { useDispatch } from "react-redux";
import LinkButton from "../UI/LinkButton/LinkButton";

export default function ProfileDropdown({ user }: { user: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();

  function closeMenu() {
    setIsOpen(false);
  }

  function toggleSection(section: string) {
    setActiveSection((prev) => (prev === section ? null : section));
  }

  return (
    <div className={styles.profiledropdown}>
      <div
        className={styles.profiledropdown__profile}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={styles.profiledropdown__user}>{user}</div>

        <Image
          src={avatar}
          width={30}
          height={30}
          alt="Аватарка"
          className={styles.profiledropdown__img}
        />
      </div>

      <div
        className={`${styles.profiledropdown__menu} ${
          isOpen
            ? styles.profiledropdown__menu_open
            : styles.profiledropdown__menu_close
        }`}
      >
        <button
          type="button"
          className={`${styles.profiledropdown__menu_button} ${
            !isOpen ? styles.profiledropdown__menu_button_hidden : ""
          }`}
          onClick={closeMenu}
        />

        <div className={styles.profiledropdown__menu_inner}>
          <Button
            type="button"
            onClick={() => {
              router.push("/dashboard");
              closeMenu();
            }}
          >
            Главная
          </Button>

          <div className={styles.profiledropdown__menu_navigation}>
            <div className={styles.profiledropdown__menu_navigation_section}>
              <button
                type="button"
                className={styles.profiledropdown__menu_navigation_title}
                onClick={() => toggleSection("learn")}
              >
                Учить
                <div
                  className={`${styles.profiledropdown__arrow} ${
                    activeSection === "learn"
                      ? styles.profiledropdown__arrow_open
                      : ""
                  }`}
                />
              </button>

              {activeSection === "learn" && (
                <ul className={styles.profiledropdown__menu_links}>
                  <li
                    onClick={closeMenu}
                    className={styles.profiledropdown__menu_link}
                  >
                    <LinkButton href="/kana/katakana" text="Изучить катакану" />
                  </li>

                  <li
                    onClick={closeMenu}
                    className={styles.profiledropdown__menu_link}
                  >
                    <LinkButton
                      href="/kana/katakana?type=repeat"
                      text="Повторить катакану"
                    />
                  </li>

                  <li
                    onClick={closeMenu}
                    className={styles.profiledropdown__menu_link}
                  >
                    <LinkButton href="/kana/hiragana" text="Изучить хирагану" />
                  </li>

                  <li
                    onClick={closeMenu}
                    className={styles.profiledropdown__menu_link}
                  >
                    <LinkButton
                      href="/kana/hiragana?type=repeat"
                      text="Повторить хирагану"
                    />
                  </li>

                  <li
                    onClick={closeMenu}
                    className={styles.profiledropdown__menu_link}
                  >
                    <LinkButton href="/kanji/repeat" text="Учим кандзи" />
                  </li>

                  <li
                    onClick={closeMenu}
                    className={styles.profiledropdown__menu_link}
                  >
                    <LinkButton href="/words/repeat" text="Учим слова" />
                  </li>
                </ul>
              )}
            </div>

            <div className={styles.profiledropdown__menu_navigation_section}>
              <button
                className={styles.profiledropdown__menu_navigation_title}
                onClick={() => toggleSection("add")}
              >
                Добавить
                <div
                  className={`${styles.profiledropdown__arrow} ${
                    activeSection === "add"
                      ? styles.profiledropdown__arrow_open
                      : ""
                  }`}
                />
              </button>

              {activeSection === "add" && (
                <ul className={styles.profiledropdown__menu_links}>
                  <li
                    onClick={closeMenu}
                    className={styles.profiledropdown__menu_link}
                  >
                    <LinkButton href="/kanji/add" text="Добавить кандзи" />
                  </li>

                  <li
                    onClick={closeMenu}
                    className={styles.profiledropdown__menu_link}
                  >
                    <LinkButton href="/words/add" text="Добавить слово" />
                  </li>
                </ul>
              )}
            </div>

            <div className={styles.profiledropdown__menu_navigation_section}>
              <button
                className={styles.profiledropdown__menu_navigation_title}
                onClick={() => toggleSection("library")}
              >
                Библиотека
                <div
                  className={`${styles.profiledropdown__arrow} ${
                    activeSection === "library"
                      ? styles.profiledropdown__arrow_open
                      : ""
                  }`}
                />
              </button>

              {activeSection === "library" && (
                <ul className={styles.profiledropdown__menu_links}>
                  <li
                    onClick={closeMenu}
                    className={styles.profiledropdown__menu_link}
                  >
                    <LinkButton
                      href="/tables/table-kana"
                      text="Таблица азбук"
                    />
                  </li>

                  <li
                    onClick={closeMenu}
                    className={styles.profiledropdown__menu_link}
                  >
                    <LinkButton href="/tables/table-kanji" text="Все кандзи" />
                  </li>

                  <li
                    onClick={closeMenu}
                    className={styles.profiledropdown__menu_link}
                  >
                    <LinkButton href="/tables/table-words" text="Все слова" />
                  </li>
                </ul>
              )}
            </div>
          </div>

          <Button
            type="button"
            variant="danger"
            onClick={async () => {
              await logout();
              dispatch(logoutAction());
              closeMenu();
              router.push("/");
            }}
          >
            Выйти
          </Button>
        </div>
      </div>
    </div>
  );
}
