import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import type { Card } from "../../../models";

export type GameStatus = "started" | "stopped";

export type GameHand = {
  id: string;
  hand: Card[];
};

interface GameState {
  userId: string | null;
  username: string | null;
  roomId: string | null;
  status: GameStatus;
  hands: GameHand[] | null;
}

const initialState: GameState = {
  userId: null,
  username: null,
  roomId: null,
  status: "stopped",
  hands: null,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGameUserId(state: GameState, action: PayloadAction<string>) {
      state.userId = action.payload;
    },
    setGameUsername(state: GameState, action: PayloadAction<string>) {
      state.username = action.payload;
    },
    setGameRoomId(state: GameState, action: PayloadAction<string>) {
      state.roomId = action.payload;
    },
    setGameStatus(state: GameState, action: PayloadAction<GameStatus>) {
      state.status = action.payload;
    },
    setGameHands(state: GameState, action: PayloadAction<GameHand[]>) {
      state.hands = action.payload;
    },
    resetGame(state: GameState) {
      state.userId = null;
      state.username = null;
      state.roomId = null;
      state.status = "stopped";
      state.hands = null;
    },
  },
});

export const {
  setGameUserId,
  setGameUsername,
  setGameRoomId,
  setGameStatus,
  setGameHands,
  resetGame,
} = gameSlice.actions;

export const { reducer } = gameSlice;
