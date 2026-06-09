import { IInputField, IWordFormInput } from "@/_interface/Interface";

export const WORD_FORM_INPUTS: IInputField<IWordFormInput>[] = [
  {
    name: "word",
    inputName: "Введите слово:",
    placeholder: "ありがとう",
    type: "text",
    required: true,
  },
  {
    name: "translate",
    inputName: "Перевод:",
    placeholder: "Спасибо",
    type: "text",
    required: true,
  },
];
