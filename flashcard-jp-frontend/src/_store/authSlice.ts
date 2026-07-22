import { IAuthUser } from "@/_interface/Interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IAuthState {
  user: IAuthUser | null;
}

const initialState: IAuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IAuthUser>) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
