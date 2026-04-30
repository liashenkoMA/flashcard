"use client";

import styles from "./authmodal.module.scss";
import LoginForm from "../LoginForm/LoginForm";
import RegisterForm from "../RegisterForm/RegisterForm";
import Modal from "../UI/Portal/Modal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/_store/store";
import { closeModal, openLogin, openRegister } from "@/_store/modalSlice";

export default function AuthModal() {
  const modalState = useSelector((state: RootState) => state.modal);
  const dispatch = useDispatch();

  const handleClose = () => dispatch(closeModal());

  return (
    <Modal
      isOpen={modalState.mode !== null}
      onClose={handleClose}
      title={modalState.mode === "login" ? "Вход" : "Регистрация"}
    >
      {modalState.mode === "login" ? <LoginForm /> : <RegisterForm />}
      {modalState.mode === "login" ? (
        <p className={styles.authmodal__text}>
          Нет аккаунта?{" "}
          <button
            type="button"
            className={styles.authmodal__text_btn}
            onClick={() => {
              dispatch(openRegister());
            }}
          >
            Создать
          </button>
        </p>
      ) : (
        <p className={styles.authmodal__text}>
          Уже зарегистрировались?{" "}
          <button
            type="button"
            className={styles.authmodal__text_btn}
            onClick={() => dispatch(openLogin())}
          >
            Войти
          </button>
        </p>
      )}
    </Modal>
  );
}
