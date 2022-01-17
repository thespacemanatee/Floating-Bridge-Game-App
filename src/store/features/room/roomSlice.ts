import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import type { Player } from "../game";

export type GameStatus = "loading" | "started" | "stopped";
interface RoomState {
  isConnected: boolean;
  username: string | null;
  roomId: string | null;
  players: Player[];
  gameExists: boolean;
  gameStatus: GameStatus;
}

const initialState: RoomState = {
  isConnected: false,
  username: null,
  roomId: null,
  players: [],
  gameExists: false,
  gameStatus: "stopped",
};

const roomSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGameIsConnected(state: RoomState, action: PayloadAction<boolean>) {
      state.isConnected = action.payload;
    },
    setGameUsername(state: RoomState, action: PayloadAction<string>) {
      state.username = action.payload;
    },
    setGameRoomId(state: RoomState, action: PayloadAction<string>) {
      state.roomId = action.payload;
    },
    addPlayer(state: RoomState, action: PayloadAction<Player>) {
      state.players.push(action.payload);
    },
    removePlayer(state: RoomState, action: PayloadAction<Player>) {
      state.players = state.players.filter(
        (player) => player.id !== action.payload.id
      );
    },
    resetPlayers(state: RoomState) {
      state.players = [];
    },
    setGameExists(state: RoomState, action: PayloadAction<boolean>) {
      state.gameExists = action.payload;
    },
    setGameStatus(state: RoomState, action: PayloadAction<GameStatus>) {
      state.gameStatus = action.payload;
    },
    resetRoom(state: RoomState) {
      state.isConnected = false;
      state.username = null;
      state.roomId = null;
      state.players = [];
      state.gameExists = false;
      state.gameStatus = "stopped";
    },
  },
});

export const {
  setGameIsConnected,
  setGameUsername,
  setGameRoomId,
  addPlayer,
  removePlayer,
  resetPlayers,
  setGameExists,
  setGameStatus,
  resetRoom,
} = roomSlice.actions;

export const { reducer } = roomSlice;
