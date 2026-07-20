import { InputHTMLAttributes } from "react";

export interface IInputField<T> extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "name"
> {
  name: keyof T;
  inputName: string;
}

export interface IRegisterFormData {
  name: string;
  email: string;
  password: string;
  duplicate: string;
}

export interface IRegisterFormInput {
  name: string;
  email: string;
  password: string;
  duplicate: string;
}

export interface IProfileFormData {
  name?: string;
  email?: string;
  newPassword?: string;
  duplicate?: string;
  currentPassword: string;
}

export interface IProfileFormInput {
  name: string;
  email: string;
  newPassword: string;
  duplicate: string;
  currentPassword: string;
}

export interface IProfileResponse {
  name: string;
  email: string;
}

export interface ILoginFormData {
  email: string;
  password: string;
  duplicate: string;
}

export interface ILoginFormInput {
  email: string;
  password: string;
  duplicate: string;
}

export interface ILoginResponse {
  access_token: string;
  name: string;
}

export interface IAuthModalState {
  mode: "login" | "register" | null;
}

export interface IAuthModalContext {
  modalState: IAuthModalState;
  setModalState: (value: IAuthModalState) => void;
}

export interface IAuthContext {
  userName: string;
  setUserName: (value: string) => void;
}

export interface IKana {
  symbol: string;
  romaji: string;
  group?: "a" | "k" | "s" | "t" | "n" | "h" | "m" | "y" | "r" | "w";
  type?: "dakuten" | "handakuten" | "combo";
  isSmall?: boolean;
  learned?: boolean;
  _id: string;
  weight: number;
}

export interface IUpdateHirakanaResponse {
  message: string;
  hiraganaId: string;
  learned: boolean;
}

export interface IUpdateKatakanaResponse {
  message: string;
  katakanaId: string;
  learned: boolean;
}

export interface IKanji {
  kanji: string;
  level: "N5" | "N4" | "N3" | "N2" | "N1";
  translate: string;
  jpRead: string;
  chinaRead: string;
  learned: boolean;
  _id: string;
  weight: number;
}

export interface IKanjiFormData {
  kanji: string;
  level: "N5" | "N4" | "N3" | "N2" | "N1";
  jpRead: string;
  chinaRead: string;
  translate: string;
}

export interface IKanjiFormInput {
  kanji: string;
  jpRead: string;
  chinaRead: string;
  translate: string;
}

export interface IWord {
  _id: string;
  word: string;
  translate: string;
  category: string;
  weight: number;
}

export interface IWordFormData {
  word: string;
  translate: string;
  category: string;
}

export interface IWordFormInput {
  word: string;
  translate: string;
}

export interface IWeightCard {
  weight: number;
}

export interface IWeightStatus {
  status: "remember" | "forgot";
}

export interface IUpdateHiraganaWeightResponse {
  message: string;
  hiraganaId: string;
}

export interface IUpdateKatakanaWeightResponse {
  message: string;
  katakanaId: string;
}

export interface IUpdateKanjiWeightResponse {
  message: string;
}

export interface IUpdateWordWeightResponse {
  message: string;
}

export interface IFAQ {
  header: string;
  text: string;
}

export interface IReview {
  user: string;
  learned: string;
  message: string;
}

export interface IHangeul {
  _id: string;
  symbol: string;
  romaji: string;
  group?:
    | "basic-consonant"
    | "double-consonant"
    | "basic-vowel"
    | "compound-vowel";
  learned?: boolean;
  weight: number;
}

export interface IUpdateHangeulResponse {
  message: string;
  hangeulId: string;
  learned: boolean;
}

export interface IUpdateHangeulWeightResponse {
  message: string;
  hangeulId: string;
}

export interface ICnWordFormInput {
  word: string;
  translate: string;
  pinyin: string;
}

export interface ICnWordFormData {
  word: string;
  translate: string;
  pinyin: string;
  category: string;
}

export interface ICnWord {
  _id: string;
  word: string;
  translate: string;
  category: string;
  pinyin: string;
  weight: number;
}

export interface IHanzi {
  _id: string;
  category: string;
  hanzi: string;
  translate: string;
  pinyin: string;
  weight: number;
}

export interface IHanziFormData {
  hanzi: string;
  pinyin: string;
  category: string;
  translate: string;
}

export interface IHanziFormInput {
  hanzi: string;
  pinyin: string;
  translate: string;
}

export interface IUpdateHanziWeightResponse {
  message: string;
}

export interface ITelegramFormData {
  name: string;
  text: string;
}
