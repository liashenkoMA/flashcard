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
}

export interface IUpdateHirakanaResponse {
  message: string;
  hiraganaId: string;
}

export interface IUpdateKatakanaResponse {
  message: string;
  katakanaId: string;
}

export interface IKanji {
  kanji: string;
  translate: string;
  jpRead: string;
  chinaRead: string;
  learned: boolean;
  _id: string;
}
