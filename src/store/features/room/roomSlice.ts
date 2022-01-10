import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import type { Member } from "../../../types";

interface RoomState {
  userId: string;
  username: string;
  roomId: string;
  isAdmin: boolean;
  players: Member[];
}

const initialState: RoomState = {
  userId: "",
  username: "",
  roomId: "",
  isAdmin: false,
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
    setIsAdmin(state: RoomState, action: PayloadAction<boolean>) {
      state.isAdmin = action.payload;
    },
    addPlayer(state: RoomState, action: PayloadAction<Member>) {
      state.players.push(action.payload);
    },
    removePlayer(state: RoomState, action: PayloadAction<Member>) {
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
      state.isAdmin = false;
      state.players = [];
    },
  },
});

export const {
  setGameUserId,
  setGameUsername,
  setGameRoomId,
  setIsAdmin,
  addPlayer,
  removePlayer,
  resetPlayers,
  resetRoom,
} = roomSlice.actions;

export const { reducer } = roomSlice;
