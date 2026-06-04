import { IInputField, IKanjiFormInput } from "@/_interface/Interface";

export const KANJI_FORM_INPUTS: IInputField<IKanjiFormInput>[] = [
  {
    name: "kanji",
    inputName: "Введите кандзи:",
    placeholder: "日",
    type: "text",
    required: true,
  },
  {
    name: "jpRead",
    inputName: "Кунъёми:",
    placeholder: "ひ",
    type: "text",
    required: true,
  },
  {
    name: "chinaRead",
    inputName: "Онъёми:",
    placeholder: "ニチ",
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
];
