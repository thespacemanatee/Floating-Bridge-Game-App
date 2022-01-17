import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  userId: string;
}

const initialState: AuthState = {
  userId: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserId(state: AuthState, action: PayloadAction<string>) {
      state.userId = action.payload;
    },
  },
});

export const { setUserId } = authSlice.actions;

export const { reducer } = authSlice;
