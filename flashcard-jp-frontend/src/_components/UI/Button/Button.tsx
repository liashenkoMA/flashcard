import styles from "./button.module.scss";
import { ButtonHTMLAttributes } from "react";

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  disabled?: boolean;
}

export default function Button(props: IButtonProps) {
  const { text, disabled, ...rest } = props;

  return (
    <button
      className={`${styles.button} ${disabled ? styles.button__disabled : ""}`}
      disabled={disabled}
      {...rest}
    >
      {text}
    </button>
  );
}
