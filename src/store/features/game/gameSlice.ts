import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import type { Card } from "../../../models";

export type GameStatus = "started" | "stopped";

export type GameHand = {
  id: string;
  hand: Card[];
};

interface GameState {
  status: GameStatus;
  hands: GameHand[] | null;
}

const initialState: GameState = {
  status: "stopped",
  hands: null,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGameStatus(state: GameState, action: PayloadAction<GameStatus>) {
      state.status = action.payload;
    },
    setHands(state: GameState, action: PayloadAction<GameHand[]>) {
      state.hands = action.payload;
    },
  },
});

export const { setGameStatus, setHands: setGameHands } = gameSlice.actions;
export const { reducer } = gameSlice;
