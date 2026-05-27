import { IInputField, IProfileFormInput } from "@/_interface/Interface";

export const PROFILE_FORM_INPUTS: IInputField<IProfileFormInput>[] = [
  {
    name: "name",
    inputName: "Изменить имя:",
    placeholder: "Иван",
    type: "text",
    minLength: 2,
    maxLength: 30,
  },
  {
    name: "email",
    inputName: "Изменить email:",
    placeholder: "ivan@mail.ru",
    type: "email",
    pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-z]{2,3}$",
  },
  {
    name: "newPassword",
    inputName: "Изменить пароль:",
    placeholder: "Введите новый пароль",
    type: "password",
    minLength: 2,
    maxLength: 20,
  },
  {
    name: "duplicate",
    inputName: "Повторите пароль:",
    placeholder: "Повторите новый пароль",
    type: "password",
    minLength: 2,
    maxLength: 20,
  },
  {
    name: "currentPassword",
    inputName: "Текущий пароль:",
    placeholder: "Подтвердите изменения",
    type: "password",
    minLength: 2,
    maxLength: 20,
  },
];
