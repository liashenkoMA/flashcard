"use client";

import styles from "./modal.module.scss";
import { createPortal } from "react-dom";
import { useEffect, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

export default function Modal(props: ModalProps) {
  const { isOpen, onClose, children, title } = props;
  const isPointerDownOnOverlay = useRef(false);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  function handleClickDown(e: React.PointerEvent<HTMLDivElement>) {
    isPointerDownOnOverlay.current = e.target === e.currentTarget;
  }

  function handleOverlayClickUp(e: React.PointerEvent<HTMLDivElement>) {
    const isPointerUpOnOverlay = e.target === e.currentTarget;

    if (isPointerDownOnOverlay.current && isPointerUpOnOverlay) {
      onClose();
    }

    isPointerDownOnOverlay.current = false;
  }

  if (!isOpen) return null;

  return createPortal(
    <div
      className={styles.modal}
      onPointerDown={handleClickDown}
      onPointerUp={handleOverlayClickUp}
      data-testid="overlay"
    >
      <div className={styles.modal__content}>
        {title && <h2 className={styles.modal__title}>{title}</h2>}
        <button
          className={styles.modal__button}
          onClick={onClose}
          aria-label="Закрыть"
        />
        {children}
      </div>
    </div>,
    document.body,
  );
}
