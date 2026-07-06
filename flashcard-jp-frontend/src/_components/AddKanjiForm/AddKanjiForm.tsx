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
  level: z.enum(["N5", "N4", "N3", "N2", "N1"]),
  jpRead: z.string().min(1, "Введите японское чтение `Кунъёми`"),
  chinaRead: z.string().min(1, "Введите китайское чтение `Онъёми`"),
  translate: z.string().min(1, "Введите перевод"),
});

type KanjiFormType = z.infer<typeof formSchema>;
type Level = "N5" | "N4" | "N3" | "N2" | "N1";

const InitialFormState: KanjiFormType = {
  kanji: "",
  level: "N5",
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

  function handleLevelChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value as Level;

    setFormData({ ...formData, level: value });
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
        <label className={styles.addKanjiForm__form_field}>
          <span className={styles.addKanjiForm__placeholder}>
            Выберите уровень:
          </span>
          <select
            className={styles.addKanjiForm__lists}
            name="level"
            id="level"
            value={formData.level}
            onChange={handleLevelChange}
          >
            <option value="N5">N5</option>
            <option value="N4">N4</option>
            <option value="N3">N3</option>
            <option value="N2">N2</option>
            <option value="N1">N1</option>
          </select>
        </label>
        <span className={styles.addKanjiForm__errors}>
          {errors?.fieldErrors?.level?.join(", ")}
        </span>
        {KANJI_FORM_INPUTS.map((input) => (
          <Input
            key={input.name}
            {...input}
            value={formData[input.name]}
            onChange={handleChange}
            errors={errors?.fieldErrors?.[input.name]?.join(", ")}
          />
        ))}
        <span className={styles.addKanjiForm__success}>{serverMessage}</span>
        <Button type="submit" disabled={loading || Boolean(errors)}>
          {loading ? "Отправка..." : "Добавить"}
        </Button>
        <span className={styles.addKanjiForm__errors}>
          {serverErrorMessage}
        </span>
      </Form>
    </div>
  );
}
