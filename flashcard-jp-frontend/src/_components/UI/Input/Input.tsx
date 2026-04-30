import styles from "./input.module.scss";
import { InputHTMLAttributes } from "react";

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  value: string;
  inputName: string;
  errors?: string;
}

export default function Input(props: IInputProps) {
  const { value, onChange, errors, inputName, ...rest } = props;

  return (
    <label className={styles.form__field}>
      <span className={styles.input__placeholder}>{inputName}</span>
      <input
        className={styles.input}
        value={value}
        onChange={onChange}
        {...rest}
      ></input>
      <span className={styles.input__error}>{errors ? errors : ""}</span>
    </label>
  );
}
