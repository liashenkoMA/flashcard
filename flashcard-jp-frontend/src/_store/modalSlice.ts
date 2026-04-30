"use client";

import { IAuthModalState } from "@/_interface/Interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: IAuthModalState = {
  mode: null,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openLogin(state) {
      state.mode = "login";
    },
    openRegister(state) {
      state.mode = "register";
    },
    closeModal(state) {
      state.mode = null;
    },
    setMode(state, action: PayloadAction<IAuthModalState>) {
      state.mode = action.payload.mode;
    },
  },
});

export const { openLogin, openRegister, closeModal, setMode } =
  modalSlice.actions;

export default modalSlice.reducer;
