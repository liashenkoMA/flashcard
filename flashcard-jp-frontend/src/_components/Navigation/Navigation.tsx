"use client";

import styles from "./navigation.module.scss";
import Button from "../UI/Button/Button";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/_store/store";
import { setMode } from "@/_store/modalSlice";
import ProfileDropdown from "../ProfileDropdown/ProfileDropdown";

export default function Navigation() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  function handleClick(type: { mode: "login" | "register" | null }) {
    dispatch(setMode(type));
  }

  return (
    <nav className={`${styles.navigation}`}>
      <div className={`${styles.navigation__content}`}>
        {user ? (
          <ProfileDropdown user={user} />
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
              Регистрация
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}
