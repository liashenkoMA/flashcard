"use client";

import styles from "./contactform.module.scss";
import Button from "../UI/Button/Button";
import Form from "../UI/Form/Form";
import Input from "../UI/Input/Input";
import React, { useState } from "react";
import { z } from "zod";
import { telegramMessage } from "@/_utils/api/client/telegramApi";

const formSchema = z.object({
  name: z.string().min(2, { message: "Имя должно быть не короче 2 символов" }),
  text: z.string().min(1, { message: "Введите сообщение" }),
});

type ProfileFormType = z.infer<typeof formSchema>;

const initialFormState: ProfileFormType = {
  name: "",
  text: "",
};

export default function ContactForm() {
  const [formData, setFormData] = useState<ProfileFormType>(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] =
    useState<z.ZodFlattenedError<z.infer<typeof formSchema>>>();
  const [serverErrorMessage, setServerErrorMessage] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
    setErrors(undefined);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const validationResult = formSchema.safeParse(formData);

    if (!validationResult.success) {
      const errors = z.flattenError(validationResult.error);
      setErrors(errors);
      return;
    }

    setIsLoading(true);

    telegramMessage(formData)
      .then(() => {
        setFormData({ name: "", text: "" });
      })
      .catch((err) => setServerErrorMessage(err.message))
      .finally(() => setIsLoading(false));
  }

  return (
    <div className={styles.contactform}>
      <Form handleSubmit={handleSubmit}>
        <Input
          type="text"
          name="name"
          onChange={handleChange}
          value={formData["name"]}
          errors={errors?.fieldErrors?.["name"]?.join(", ")}
          inputName="Ваше имя:"
          placeholder="Иван"
        />
        <label className={styles.contactform__form_field}>
          <span className={styles.contactform__text}>Ваше сообщение:</span>
          <textarea
            name="text"
            placeholder="Введите ваше сообщение"
            className={`${styles.contactform__input_textarea}`}
            onChange={handleChange}
            value={formData["text"]}
          ></textarea>
          <span className={styles.contactform__error}>
            {errors?.fieldErrors?.["text"]?.join(", ")}
          </span>
        </label>
        <Button type="submit" disabled={isLoading || Boolean(errors)}>
          Отправить сообщение
        </Button>
        <span className={styles.contactform__error}>{serverErrorMessage}</span>
      </Form>
    </div>
  );
}
