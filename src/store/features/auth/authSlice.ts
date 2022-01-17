import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  userId: string | null;
}

const initialState: AuthState = {
  userId: null,
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
