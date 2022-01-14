import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import type { Player } from "../game";

interface RoomState {
  userId: string;
  username: string;
  roomId: string;
  players: Player[];
}

const initialState: RoomState = {
  userId: "",
  username: "",
  roomId: "",
  players: [],
};

const roomSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGameUserId(state: RoomState, action: PayloadAction<string>) {
      state.userId = action.payload;
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
    resetRoom(state: RoomState) {
      state.userId = "";
      state.username = "";
      state.roomId = "";
      state.players = [];
    },
  },
});

export const {
  setGameUserId,
  setGameUsername,
  setGameRoomId,
  addPlayer,
  removePlayer,
  resetPlayers,
  resetRoom,
} = roomSlice.actions;

export const { reducer } = roomSlice;
