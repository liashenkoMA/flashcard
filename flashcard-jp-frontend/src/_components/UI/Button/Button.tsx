import styles from "./button.module.scss";
import { ButtonHTMLAttributes } from "react";

type ButtonVariant = "default" | "success" | "danger";

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  disabled?: boolean;
}

export default function Button({
  children,
  variant = "default",
  disabled,
  ...rest
}: IButtonProps) {
  return (
    <button
      className={`${styles.button} ${disabled ? styles.button__disabled : ""} ${styles[variant]}`}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
