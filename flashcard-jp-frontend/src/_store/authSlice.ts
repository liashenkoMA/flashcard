import { IAuthContext } from "@/_interface/Interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IAuthState {
  userName: IAuthContext["userName"];
}

const initialState: IAuthState = {
  userName: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserName(state, action: PayloadAction<IAuthContext["userName"]>) {
      state.userName = action.payload;
    },
    logout(state) {
      state.userName = "";
    },
  },
});

export const { setUserName, logout } = authSlice.actions;
export default authSlice.reducer;
