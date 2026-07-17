import { IHanziFormInput, IInputField } from "@/_interface/Interface";

export const HANZI_FORM_INPUTS: IInputField<IHanziFormInput>[] = [
  {
    name: "hanzi",
    inputName: "Введите ханзи:",
    placeholder: "日",
    type: "text",
    required: true,
  },
  {
    name: "translate",
    inputName: "Перевод:",
    placeholder: "день, солнце",
    type: "text",
    required: true,
  },
  {
    name: "pinyin",
    inputName: "Транскрипция:",
    placeholder: "rì",
    type: "text",
    required: true,
  },
];
