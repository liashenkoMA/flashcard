import { IInputField, IWordFormInput } from "@/_interface/Interface";

export const KR_WORD_FORM_INPUTS: IInputField<IWordFormInput>[] = [
  {
    name: "word",
    inputName: "Введите слово:",
    placeholder: "안녕",
    type: "text",
    required: true,
  },
  {
    name: "translate",
    inputName: "Перевод:",
    placeholder: "Привет",
    type: "text",
    required: true,
  },
];
