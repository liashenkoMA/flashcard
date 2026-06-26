"use client";

import styles from "./addKanjiForm.module.scss";
import React, { useState } from "react";
import Form from "../UI/Form/Form";
import { KANJI_FORM_INPUTS } from "@/_constants/kanjiAddFrom.constant";
import Input from "../UI/Input/Input";
import { z } from "zod";
import Button from "../UI/Button/Button";
import { addKanji } from "@/_utils/api/client/kanjiApi";

const formSchema = z.object({
  kanji: z.string().min(1, "Введите кандзи"),
  jpRead: z.string().min(1, "Введите японское чтение `Кунъёми`"),
  chinaRead: z.string().min(1, "Введите китайское чтение `Онъёми`"),
  translate: z.string().min(1, "Введите перевод"),
});

type KanjiFormType = z.infer<typeof formSchema>;

const InitialFormState: KanjiFormType = {
  kanji: "",
  jpRead: "",
  chinaRead: "",
  translate: "",
};

export default function AddKanjiForm() {
  const [formData, setFormData] = useState<KanjiFormType>(InitialFormState);
  const [errors, setErrors] =
    useState<z.ZodFlattenedError<z.infer<typeof formSchema>>>();
  const [loading, setIsLoading] = useState(false);
  const [serverErrorMessage, setServerErrorMessage] = useState("");
  const [serverMessage, setServerMessage] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    const value = e.target.value.trim();

    setFormData({ ...formData, [name]: value });
    setErrors(undefined);
    setServerMessage("");
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
    setServerErrorMessage("");

    addKanji(formData)
      .then((res) => {
        setFormData(InitialFormState);
        setServerMessage(res.data);
      })
      .catch((err) => setServerErrorMessage(err.message))
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div className={styles.addKanjiForm__form}>
      <Form handleSubmit={handleSubmit}>
        {KANJI_FORM_INPUTS.map((input) => (
          <Input
            key={input.name}
            {...input}
            value={formData[input.name]}
            onChange={handleChange}
            errors={errors?.fieldErrors?.[input.name]?.join(", ")}
          />
        ))}
        <span className={styles.addkanjiform__success}>{serverMessage}</span>
        <Button type="submit" disabled={loading || Boolean(errors)}>
          {loading ? "Отправка..." : "Добавить"}
        </Button>
        <span className={styles.addkanjiform__errors}>
          {serverErrorMessage}
        </span>
      </Form>
    </div>
  );
}
