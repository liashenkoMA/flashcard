import { IInputField, ICnWordFormInput } from "@/_interface/Interface";

export const CN_WORD_FORM_INPUTS: IInputField<ICnWordFormInput>[] = [
  {
    name: "word",
    inputName: "Введите слово:",
    placeholder: "你好",
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
  {
    name: "pinyin",
    inputName: "Транскрипция:",
    placeholder: "nǐ hǎo",
    type: "text",
    required: true,
  },
];
