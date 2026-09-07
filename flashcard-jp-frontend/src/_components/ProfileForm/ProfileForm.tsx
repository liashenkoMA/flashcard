"use client";

import styles from "./profileform.module.scss";
import { useState } from "react";
import Form from "../UI/Form/Form";
import { PROFILE_FORM_INPUTS } from "@/_constants/profileForm.constant";
import Input from "../UI/Input/Input";
import { z } from "zod";
import Button from "../UI/Button/Button";
import { updateUser } from "@/_utils/api/client/userApi";
import DeleteProfileModule from "../DeleteProfileModal/DeleteProfileModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/_store/store";
import { setUser } from "@/_store/authSlice";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Имя должно быть не короче 2 символов" })
    .or(z.literal("")),
  email: z.email({ message: "Введите корректный email" }).or(z.literal("")),
  newPassword: z
    .string()
    .min(2, { message: "Пароль слишком короткий" })
    .max(20, { message: "Пароль слишком длинный" })
    .or(z.literal("")),
  duplicate: z.string().or(z.literal("")),
  currentPassword: z.string().refine((val) => val.length > 0, {
    message: "Введите текущий пароль для подтверждения изменений",
  }),
});

type ProfileFormType = z.infer<typeof formSchema>;

const initialFormState: ProfileFormType = {
  name: "",
  email: "",
  newPassword: "",
  duplicate: "",
  currentPassword: "",
};

export default function ProfileForm() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [formData, setFormData] = useState<ProfileFormType>(() => ({
    ...initialFormState,
    name: user?.name ?? "",
    email: user?.email ?? "",
  }));
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] =
    useState<z.ZodFlattenedError<z.infer<typeof formSchema>>>();
  const [serverErrorMessage, setServerErrorMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    const value = e.target.value.trim();

    setFormData({ ...formData, [name]: value });
    setErrors(undefined);
  }

  const passwordMismatch = formData.newPassword !== formData.duplicate;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const validationResult = formSchema.safeParse(formData);

    if (!validationResult.success) {
      const errors = z.flattenError(validationResult.error);
      setErrors(errors);
      return;
    }

    setIsLoading(true);

    updateUser(formData)
      .then((res) => {
        setFormData({
          name: res.name,
          email: res.email,
          newPassword: "",
          currentPassword: "",
          duplicate: "",
        });

        if (user) {
          dispatch(
            setUser({
              ...user,
              name: res.name,
              email: res.email,
            }),
          );
        }
      })
      .catch((err) => setServerErrorMessage(err.message))
      .finally(() => setIsLoading(false));
  }

  function openDeleteProfileModal() {
    setIsOpen(!isOpen);
  }

  return (
    <div className={styles.profile__form}>
      <Form handleSubmit={handleSubmit}>
        {PROFILE_FORM_INPUTS.map((input) => (
          <Input
            key={input.name}
            {...input}
            onChange={handleChange}
            errors={errors?.fieldErrors?.[input.name]?.join(", ")}
            value={formData[input.name] ?? ""}
            inputName={input.inputName}
          />
        ))}
        <span className={styles.profileform__errors}>
          {passwordMismatch ? "Пароли не совпадают." : ""}
        </span>
        <Button type="submit" disabled={isLoading || Boolean(errors)}>
          {isLoading ? "Сохраняем изменения..." : "Изменить профиль"}
        </Button>
        <span className={styles.profileform__errors}>{serverErrorMessage}</span>
      </Form>
      <div className={styles.profileform__btn_type_delete}>
        <p className={styles.profileform__text}>Хотите удалить ваш профиль?</p>
        <Button
          type="button"
          onClick={openDeleteProfileModal}
          disabled={isLoading}
          variant="danger"
        >
          Удалить профиль
        </Button>
        <DeleteProfileModule isOpen={isOpen} onClose={openDeleteProfileModal} />
      </div>
    </div>
  );
}
