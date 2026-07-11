"use client";

import styles from "./addKrWordForm.module.scss";
import { addKrWord, getKrWordsCategory } from "@/_utils/api/client/krWordsApi";
import { useEffect, useState } from "react";
import { z } from "zod";
import Form from "../UI/Form/Form";
import { KR_WORD_FORM_INPUTS } from "@/_constants/krWordAddForm.constant";
import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";

const formSchema = z.object({
  word: z.string().min(1, "Введите слово"),
  translate: z.string().min(1, "Введите перевод"),
  category: z.string().min(1, "Укажите категорию"),
});

type WordFormType = z.infer<typeof formSchema>;

const InitialWordState = {
  word: "",
  translate: "",
  category: "Без категории",
};

export default function AddKrWordForm() {
  const [formData, setFormData] = useState<WordFormType>(InitialWordState);
  const [categoryList, setCategoryList] = useState<string[]>([]);
  const [selectCategory, setSelectCategory] = useState("Без категории");
  const [errors, setErrors] =
    useState<z.ZodFlattenedError<z.infer<typeof formSchema>>>();
  const [loading, setIsLoading] = useState(false);
  const [serverErrorMessage, setServerErrorMessage] = useState("");
  const [serverMessage, setServerMessage] = useState("");

  useEffect(() => {
    getKrWordsCategory()
      .then((res) => setCategoryList(res))
      .catch((err) => console.log(err));
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    const value = e.target.value.trim();

    setFormData({ ...formData, [name]: value });
    setErrors(undefined);
    setServerMessage("");
  }

  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;

    setSelectCategory(value);
    setErrors(undefined);

    if (value === "Новая категория?") {
      setFormData({ ...formData, category: "" });
    } else {
      setFormData({
        ...formData,
        category: value,
      });
    }
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

    addKrWord(formData)
      .then((res) => {
        setFormData(InitialWordState);
        setSelectCategory("Без категории");
        setCategoryList((prev) =>
          prev.includes(formData.category)
            ? prev
            : [...prev, formData.category],
        );
        setServerMessage(res.data);
      })
      .catch((err) => setServerErrorMessage(err.message))
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div className={styles.addKrWordForm__form}>
      <Form handleSubmit={handleSubmit}>
        {KR_WORD_FORM_INPUTS.map((input) => (
          <Input
            key={input.name}
            {...input}
            value={formData[input.name]}
            onChange={handleChange}
            inputName={input.inputName}
            errors={errors?.fieldErrors?.[input.name]?.join(", ")}
          />
        ))}
        <label className={styles.addKrWordForm__form_field}>
          <select
            onChange={handleCategoryChange}
            value={selectCategory}
            className={styles.addKrWordForm__lists}
            id="category"
            name="category"
          >
            <option value="Без категории">Без категории</option>
            {categoryList
              .filter((el) => el !== "Без категории")
              .map((list) => (
                <option key={list} value={list}>
                  {list}
                </option>
              ))}
            <option value="Новая категория?">+ новая категория</option>
          </select>
        </label>
        {selectCategory === "Новая категория?" && (
          <Input
            name="category"
            value={formData.category}
            onChange={handleChange}
            inputName="Категория:"
          ></Input>
        )}
        <span
          className={`${styles.addKrWordForm__text} ${styles.addKrWordForm__success}`}
        >
          {serverMessage}
        </span>
        <span
          className={`${styles.addKrWordForm__text} ${styles.addKrWordForm__errors}`}
        >
          {errors && errors?.fieldErrors?.category?.join(", ")}
        </span>
        <Button type="submit" disabled={loading || Boolean(errors)}>
          {loading ? "Отправка..." : "Добавить"}
        </Button>
        <span
          className={`${styles.addKrWordForm__text} ${styles.addKrWordForm__errors}`}
        >
          {serverErrorMessage}
        </span>
      </Form>
    </div>
  );
}
