"use client";

import styles from "./navigation.module.scss";
import Button from "../UI/Button/Button";
import { useEffect, useState } from "react";
import { getUser } from "@/_utils/client/userApi";
import { useRouter } from "next/navigation";
import { logout } from "@/_utils/server/authApi";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/_store/store";
import { setUserName, logout as logoutAction } from "@/_store/authSlice";
import { setMode } from "@/_store/modalSlice";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const userName = useSelector((state: RootState) => state.auth.userName);
  const router = useRouter();

  useEffect(() => {
    if (!userName) {
      getUser()
        .then((res) => dispatch(setUserName(res.name)))
        .catch((err) => console.log(err));
    }
  }, [userName, dispatch]);

  function handleOpenMenu() {
    setIsOpen(!isOpen);
  }

  function handleClick(type: { mode: "login" | "register" | null }) {
    dispatch(setMode(type));
    handleOpenMenu();
  }

  return (
    <nav
      className={`${styles.navigation} ${
        isOpen && styles.navigation_type_open
      }`}
    >
      <button
        type="button"
        onClick={handleOpenMenu}
        className={`${styles.navigation__button} ${
          isOpen
            ? styles.navigation__button_type_close
            : styles.navigation__button_type_open
        }`}
        data-testid="menu-toggle"
      ></button>
      <div
        className={`${styles.navigation__content} ${
          !isOpen && styles.navigation__content_type_close
        }`}
      >
        {userName ? (
          <>
            <Button
              type="button"
              onClick={() => {
                router.push("/dashboard");
                handleOpenMenu();
              }}
            >
              Личный кабинет
            </Button>
            <Button
              type="button"
              onClick={async () => {
                await logout();
                dispatch(logoutAction());
                router.push("/");
              }}
            >
              Выйти
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              onClick={() => handleClick({ mode: "login" })}
            >
              Войти
            </Button>
            <Button
              type="button"
              onClick={() => handleClick({ mode: "register" })}
            >
              Зарегистрироваться
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}
