"use client";

import styles from "./loginform.module.scss";
import Button from "../UI/Button/Button";
import Input from "../UI/Input/Input";
import { LOGIN_FORM_INPUTS } from "@/_constants/loginForm.constant";
import { useState } from "react";
import Form from "../UI/Form/Form";
import { z } from "zod";
import { login } from "@/_utils/server/authApi";
import { useRouter } from "next/navigation";

import { useDispatch } from "react-redux";
import { setUserName } from "@/_store/authSlice";
import { closeModal } from "@/_store/modalSlice";

const formSchema = z.object({
  email: z.email({ message: "Введите корректный email" }),
  password: z
    .string()
    .min(2, { message: "Пароль слишком короткий" })
    .max(20, { message: "Пароль слишком длинный" }),
  duplicate: z.string(),
});

type LoginFormType = z.infer<typeof formSchema>;

const InitialFormState: LoginFormType = {
  email: "",
  password: "",
  duplicate: "",
};

export default function LoginForm() {
  const [formData, setFormData] = useState<LoginFormType>(InitialFormState);
  const [errors, setErrors] =
    useState<z.ZodFlattenedError<z.infer<typeof formSchema>>>();
  const [loading, setIsLoading] = useState(false);
  const [serverErrorMessage, setServerErrorMessage] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    const value = e.target.value;

    setFormData({ ...formData, [name]: value });
    setErrors(undefined);
  }

  const passwordMismatch = formData.password !== formData.duplicate;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const validationResult = formSchema.safeParse(formData);

    if (!validationResult.success) {
      const errors = z.flattenError(validationResult.error);
      setErrors(errors);
      return;
    }

    setIsLoading(true);

    login(formData)
      .then((res) => {
        dispatch(setUserName(res.name));
        dispatch(closeModal());
        router.push("/dashboard");
      })
      .catch((err) => setServerErrorMessage(err.message))
      .finally(() => setIsLoading(false));
  }

  return (
    <Form handleSubmit={handleSubmit}>
      {LOGIN_FORM_INPUTS.map((input) => (
        <Input
          key={input.name}
          {...input}
          value={formData[input.name]}
          onChange={handleChange}
          errors={errors?.fieldErrors?.[input.name]?.join(", ")}
        />
      ))}
      <span className={styles.loginform__errors}>
        {passwordMismatch ? "Пароли не совпадают." : ""}
      </span>
      <Button
        type="submit"
        disabled={passwordMismatch || loading || Boolean(errors)}
        text={loading ? "Авторизация..." : "Войти"}
      />
      <span className={styles.loginform__errors}>{serverErrorMessage}</span>
    </Form>
  );
}
