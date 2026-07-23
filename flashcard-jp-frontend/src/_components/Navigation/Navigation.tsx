"use client";

import styles from "./navigation.module.scss";
import Button from "../UI/Button/Button";
import { useEffect } from "react";
import { getUser } from "@/_utils/api/client/userApi";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/_store/store";
import { setUser } from "@/_store/authSlice";
import { setMode } from "@/_store/modalSlice";
import ProfileDropdown from "../ProfileDropdown/ProfileDropdown";

export default function Navigation() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!user) {
      getUser()
        .then((res) => dispatch(setUser(res)))
        .catch((err) => console.log(err));
    }
  }, [user, dispatch]);

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
