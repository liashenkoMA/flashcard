import { IInputField, IRegisterFormInput } from "@/_interface/Interface";

export const REGISTER_FORM_INPUTS: IInputField<IRegisterFormInput>[] = [
  {
    name: "name",
    inputName: "Ваше имя:",
    placeholder: "Иван",
    type: "text",
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  {
    name: "email",
    inputName: "Email:",
    placeholder: "ivan@mail.ru",
    type: "email",
    pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-z]{2,3}$",
    required: true,
  },
  {
    name: "password",
    inputName: "Пароль:",
    placeholder: "Введите пароль",
    type: "password",
    required: true,
    minLength: 2,
    maxLength: 20,
  },
  {
    name: "duplicate",
    inputName: "Подтвердите пароль:",
    placeholder: "Повторите пароль",
    type: "password",
    required: true,
    minLength: 2,
    maxLength: 20,
  },
];
