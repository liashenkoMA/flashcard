"use client";

import styles from "./addhanziform.module.scss";
import { addHanzi, getHanziCategory } from "@/_utils/api/client/hanziApi";
import { useEffect, useState } from "react";
import { z } from "zod";
import Form from "../UI/Form/Form";
import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";
import { HANZI_FORM_INPUTS } from "@/_constants/hanziAddForm.constant";

const formSchema = z.object({
  hanzi: z.string().min(1, "Введите ханзи"),
  translate: z.string().min(1, "Введите перевод"),
  pinyin: z.string().min(1, "Введите транскрипцию (pinyin)"),
  category: z.string().min(1, "Укажите категорию"),
});

type HanziFormType = z.infer<typeof formSchema>;

const InitialHanziState = {
  hanzi: "",
  translate: "",
  pinyin: "",
  category: "Без категории",
};

export default function AddHanziForm() {
  const [formData, setFormData] = useState<HanziFormType>(InitialHanziState);
  const [categoryList, setCategoryList] = useState<string[]>([]);
  const [selectCategory, setSelectCategory] = useState("Без категории");
  const [errors, setErrors] =
    useState<z.ZodFlattenedError<z.infer<typeof formSchema>>>();
  const [loading, setIsLoading] = useState(false);
  const [serverErrorMessage, setServerErrorMessage] = useState("");
  const [serverMessage, setServerMessage] = useState("");

  useEffect(() => {
    getHanziCategory()
      .then((res) => setCategoryList(res))
      .catch((err) => console.log(err));
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    const value = e.target.value;

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

    addHanzi(formData)
      .then((res) => {
        setFormData(InitialHanziState);
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
    <div className={styles.addHanziForm__form}>
      <Form handleSubmit={handleSubmit}>
        {HANZI_FORM_INPUTS.map((input) => (
          <Input
            key={input.name}
            {...input}
            value={formData[input.name]}
            onChange={handleChange}
            inputName={input.inputName}
            errors={errors?.fieldErrors?.[input.name]?.join(", ")}
          />
        ))}
        <label className={styles.addHanziForm__form_field}>
          <select
            onChange={handleCategoryChange}
            value={selectCategory}
            className={styles.addHanziForm__lists}
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
          className={`${styles.addHanziForm__text} ${styles.addHanziForm__success}`}
        >
          {serverMessage}
        </span>
        <span
          className={`${styles.addHanziForm__text} ${styles.addHanziForm__errors}`}
        >
          {errors && errors?.fieldErrors?.category?.join(", ")}
        </span>
        <Button type="submit" disabled={loading || Boolean(errors)}>
          {loading ? "Отправка..." : "Добавить"}
        </Button>
        <span
          className={`${styles.addHanziForm__text} ${styles.addHanziForm__errors}`}
        >
          {serverErrorMessage}
        </span>
      </Form>
    </div>
  );
}
