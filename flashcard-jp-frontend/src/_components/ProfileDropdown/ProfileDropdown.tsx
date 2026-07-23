"use client";

import styles from "./ProfileDropdown.module.scss";
import Image from "next/image";
import avatar from "../../_images/avatar.png";
import { useEffect, useRef, useState } from "react";
import Button from "../UI/Button/Button";
import { useRouter } from "next/navigation";
import { logout } from "@/_utils/api/server/authApi";
import { logout as logoutAction } from "@/_store/authSlice";
import { useDispatch } from "react-redux";
import LinkButton from "../UI/LinkButton/LinkButton";
import { ROUTES } from "@/_constants/routes.constant";
import { IAuthUser } from "@/_interface/Interface";

export default function ProfileDropdown({ user }: { user: IAuthUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const dropdownRef = useRef<HTMLDivElement>(null);

  function closeMenu() {
    setIsOpen(false);
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        closeMenu();
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closeMenu();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function toggleSection(section: string) {
    setActiveSection((prev) => (prev === section ? null : section));
  }

  return (
    <div className={styles.profiledropdown} ref={dropdownRef}>
      <div
        className={styles.profiledropdown__profile}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className={styles.profiledropdown__user}>
          <p className={styles.profiledropdown__user_name}>{user.name}</p>
          <p className={styles.profiledropdown__user_email}>{user.email}</p>
        </div>

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
        data-testid="profile-menu"
        data-open={isOpen}
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
                    <LinkButton
                      href={ROUTES.kanji.add}
                      text="Добавить кандзи"
                    />
                  </li>

                  <li
                    onClick={closeMenu}
                    className={styles.profiledropdown__menu_link}
                  >
                    <LinkButton
                      href={ROUTES.words.add}
                      text="Добавить японское слово"
                    />
                  </li>

                  <li
                    onClick={closeMenu}
                    className={styles.profiledropdown__menu_link}
                  >
                    <LinkButton
                      href={ROUTES.hanzi.add}
                      text="Добавить ханьцзы"
                    />
                  </li>

                  <li
                    onClick={closeMenu}
                    className={styles.profiledropdown__menu_link}
                  >
                    <LinkButton
                      href={ROUTES.cn_words.add}
                      text="Добавить китайское слово"
                    />
                  </li>

                  <li
                    onClick={closeMenu}
                    className={styles.profiledropdown__menu_link}
                  >
                    <LinkButton
                      href={ROUTES.kr_words.add}
                      text="Добавить корейское слово"
                    />
                  </li>
                </ul>
              )}
            </div>

            <div className={styles.profiledropdown__menu_navigation_section}>
              <button
                className={styles.profiledropdown__menu_navigation_title}
                onClick={() => toggleSection("japanese")}
              >
                Японский
                <div
                  className={`${styles.profiledropdown__arrow} ${
                    activeSection === "japanese"
                      ? styles.profiledropdown__arrow_open
                      : ""
                  }`}
                />
              </button>

              {activeSection === "japanese" && (
                <ul className={styles.profiledropdown__menu_links}>
                  <li
                    onClick={closeMenu}
                    className={styles.profiledropdown__menu_link}
                  >
                    <LinkButton
                      href={ROUTES.kana.hiragana.learn}
                      text="Изучить хирагану"
                    />
                  </li>

                  <li
                    onClick={closeMenu}
                    className={styles.profiledropdown__menu_link}
                  >
                    <LinkButton
                      href={ROUTES.kana.hiragana.repeat}
                      text="Повторить хирагану"
                    />
                  </li>

                  <li
                    onClick={closeMenu}
                    className={styles.profiledropdown__menu_link}
                  >
                    <LinkButton
                      href={ROUTES.kana.katakana.learn}
                      text="Изучить катакану"
                    />
                  </li>

                  <li
                    onClick={closeMenu}
                    className={styles.profiledropdown__menu_link}
                  >
                    <LinkButton
                      href={ROUTES.kana.katakana.repeat}
                      text="Повторить катакану"
                    />
                  </li>

                  <li
                    onClick={closeMenu}
                    className={styles.profiledropdown__menu_link}
                  >
                    <LinkButton href={ROUTES.kanji.study} text="Учить кандзи" />
                  </li>

                  <li
                    onClick={closeMenu}
                    className={styles.profiledropdown__menu_link}
                  >
                    <LinkButton
                      href={ROUTES.words.study}
                      text="Учить японские слова"
                    />
                  </li>
                </ul>
              )}
            </div>

            <div className={styles.profiledropdown__menu_navigation_section}>
              <button
                className={styles.profiledropdown__menu_navigation_title}
                onClick={() => toggleSection("chinese")}
              >
                Китайский
                <div
                  className={`${styles.profiledropdown__arrow} ${
                    activeSection === "chinese"
                      ? styles.profiledropdown__arrow_open
                      : ""
                  }`}
                />
              </button>

              {activeSection === "chinese" && (
                <ul className={styles.profiledropdown__menu_links}>
                  <li
                    onClick={closeMenu}
                    className={styles.profiledropdown__menu_link}
                  >
                    <LinkButton
                      href={ROUTES.hanzi.study}
                      text="Учить ханьцзы"
                    />
                  </li>

                  <li
                    onClick={closeMenu}
                    className={styles.profiledropdown__menu_link}
                  >
                    <LinkButton
                      href={ROUTES.cn_words.study}
                      text="Учить китайские слова"
                    />
                  </li>
                </ul>
              )}
            </div>

            <div className={styles.profiledropdown__menu_navigation_section}>
              <button
                className={styles.profiledropdown__menu_navigation_title}
                onClick={() => toggleSection("korean")}
              >
                Корейский
                <div
                  className={`${styles.profiledropdown__arrow} ${
                    activeSection === "korean"
                      ? styles.profiledropdown__arrow_open
                      : ""
                  }`}
                />
              </button>

              {activeSection === "korean" && (
                <ul className={styles.profiledropdown__menu_links}>
                  <li
                    onClick={closeMenu}
                    className={styles.profiledropdown__menu_link}
                  >
                    <LinkButton
                      href={ROUTES.hangeul.learn}
                      text="Изучить хангуел"
                    />
                  </li>

                  <li
                    onClick={closeMenu}
                    className={styles.profiledropdown__menu_link}
                  >
                    <LinkButton
                      href={ROUTES.hangeul.repeat}
                      text="Повторить хангуел"
                    />
                  </li>

                  <li
                    onClick={closeMenu}
                    className={styles.profiledropdown__menu_link}
                  >
                    <LinkButton
                      href={ROUTES.kr_words.study}
                      text="Учить корейские слова"
                    />
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
                      href={ROUTES.tables.kana}
                      text="Таблица азбук"
                    />
                  </li>

                  <li
                    onClick={closeMenu}
                    className={styles.profiledropdown__menu_link}
                  >
                    <LinkButton href={ROUTES.tables.kanji} text="Все кандзи" />
                  </li>

                  <li
                    onClick={closeMenu}
                    className={styles.profiledropdown__menu_link}
                  >
                    <LinkButton
                      href={ROUTES.tables.words}
                      text="Все японские слова"
                    />
                  </li>

                  <li
                    onClick={closeMenu}
                    className={styles.profiledropdown__menu_link}
                  >
                    <LinkButton
                      href={ROUTES.cn_tables.hanzi}
                      text="Все ханьцзы"
                    />
                  </li>

                  <li
                    onClick={closeMenu}
                    className={styles.profiledropdown__menu_link}
                  >
                    <LinkButton
                      href={ROUTES.cn_tables.words}
                      text="Все китайские слова"
                    />
                  </li>

                  <li
                    onClick={closeMenu}
                    className={styles.profiledropdown__menu_link}
                  >
                    <LinkButton
                      href={ROUTES.kr_tables.hangeul}
                      text="Таблица хангуел"
                    />
                  </li>

                  <li
                    onClick={closeMenu}
                    className={styles.profiledropdown__menu_link}
                  >
                    <LinkButton
                      href={ROUTES.kr_tables.words}
                      text="Все корейские слова"
                    />
                  </li>
                </ul>
              )}
            </div>

            <div className={styles.profiledropdown__menu_navigation_section}>
              <button
                className={styles.profiledropdown__menu_navigation_title}
                onClick={() => toggleSection("profile")}
              >
                Профиль
                <div
                  className={`${styles.profiledropdown__arrow} ${
                    activeSection === "profile"
                      ? styles.profiledropdown__arrow_open
                      : ""
                  }`}
                />
              </button>

              {activeSection === "profile" && (
                <ul className={styles.profiledropdown__menu_links}>
                  <li
                    onClick={closeMenu}
                    className={styles.profiledropdown__menu_link}
                  >
                    <LinkButton href={ROUTES.profile} text="Мой профиль" />
                  </li>

                  <li
                    onClick={closeMenu}
                    className={styles.profiledropdown__menu_link}
                  >
                    <LinkButton href={ROUTES.contacts} text="Контакты" />
                  </li>

                  <li
                    onClick={closeMenu}
                    className={styles.profiledropdown__menu_link}
                  >
                    <LinkButton href={ROUTES.price} text="Тарифы" />
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
