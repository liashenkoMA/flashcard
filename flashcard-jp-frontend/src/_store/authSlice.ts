import { IAuthUser, IUserUsage } from "@/_interface/Interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IAuthState {
  user: IAuthUser | null;
  usage: IUserUsage | null;
}

const initialState: IAuthState = {
  user: null,
  usage: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IAuthUser>) {
      state.user = action.payload;
    },
    setUsage(state, action: PayloadAction<IUserUsage>) {
      state.usage = action.payload;
    },
    logout(state) {
      state.user = null;
      state.usage = null;
    },
  },
});

export const { setUser, setUsage, logout } = authSlice.actions;
export default authSlice.reducer;
