"use client";

import styles from "./registerform.module.scss";
import { REGISTER_FORM_INPUTS } from "@/_constants/registerForm.constant";
import Input from "../UI/Input/Input";
import { useState } from "react";
import Button from "../UI/Button/Button";
import Form from "../UI/Form/Form";
import { z } from "zod";
import { createUser } from "@/_utils/api/client/userApi";

const formSchema = z.object({
  name: z.string().min(2, { message: "Имя должно быть не короче 2 символов" }),
  email: z.email({ message: "Введите корректный email" }),
  password: z
    .string()
    .min(2, { message: "Пароль слишком короткий" })
    .max(20, { message: "Пароль слишком длинный" }),
  duplicate: z.string(),
});

type RegisterFormType = z.infer<typeof formSchema>;

const InitialFormState: RegisterFormType = {
  name: "",
  email: "",
  password: "",
  duplicate: "",
};

export default function RegisterForm() {
  const [formData, setFormData] = useState<RegisterFormType>(InitialFormState);
  const [errors, setErrors] =
    useState<z.ZodFlattenedError<z.infer<typeof formSchema>>>();
  const [serverErrorMessage, setServerErrorMessage] = useState("");
  const [serverMessage, setServerMessage] = useState("");
  const [loading, setIsLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    const value = e.target.value.trim();

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
    setServerErrorMessage("");

    createUser(formData)
      .then((res) => setServerMessage(res.data))
      .catch((err) => setServerErrorMessage(err.message))
      .finally(() => {
        setIsLoading(false);
      });
  }

  return serverMessage ? (
    <span className={styles.registerform__success}>{serverMessage}</span>
  ) : (
    <Form handleSubmit={handleSubmit}>
      {REGISTER_FORM_INPUTS.map((input) => (
        <Input
          key={input.name}
          {...input}
          value={formData[input.name]}
          onChange={handleChange}
          errors={errors?.fieldErrors?.[input.name]?.join(", ")}
        />
      ))}
      <span className={styles.registerform__errors}>
        {passwordMismatch ? "Пароли не совпадают." : ""}
      </span>
      <Button
        type="submit"
        disabled={passwordMismatch || loading || Boolean(errors)}
      >{loading ? "Отправка..." : "Зарегистрироваться"}</Button>
      <span className={styles.registerform__errors}>{serverErrorMessage}</span>
    </Form>
  );
}
