"use client";

import styles from "./modal.module.scss";
import { createPortal } from "react-dom";
import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

export default function Modal(props: ModalProps) {
  const { isOpen, onClose, children, title } = props;

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  function handleOverlayClickCloseModal(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.modal} onClick={handleOverlayClickCloseModal} data-testid="overlay">
      <div className={styles.modal__content}>
        {title && <h2 className={styles.modal__title}>{title}</h2>}
        <button className={styles.modal__button} onClick={onClose} />
        {children}
      </div>
    </div>,
    document.body
  );
}
