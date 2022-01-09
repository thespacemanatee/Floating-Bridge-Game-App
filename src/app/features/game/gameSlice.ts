import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GameState {}

const initialState: GameState = {};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {},
});

export default gameSlice.reducer;
