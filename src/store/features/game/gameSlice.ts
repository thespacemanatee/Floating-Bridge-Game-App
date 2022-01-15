import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import type { Card, PlayedCard } from "../../../models";

export type GameStatus = "started" | "stopped";

export interface Player {
  id: string;
  info: {
    username: string;
    color: string;
  };
}

export interface PlayerData extends Player {
  hand: Card[];
  sets: PlayedCard[][];
}

export interface Partner extends Card {
  userId: string;
}

export type PlayCardPayload = {
  userId: string;
  card: Card;
};

export type Trump = "c" | "d" | "h" | "s" | "n";

export type BidLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type Bid = {
  userId: string;
  trump: Trump;
  level: BidLevel;
};

interface GameState {
  gameId: string | null;
  status: GameStatus;
  players: PlayerData[];
  roundNo: number;
  userPosition: number;
  currentPosition: number;
  latestBid: Bid | null;
  bidSequence: Bid[];
  isBidding: boolean;
  partner: Partner | null;
  isTrumpBroken: boolean;
  playedCards: PlayedCard[];
}

const initialState: GameState = {
  gameId: null,
  status: "stopped",
  players: [],
  roundNo: 0,
  userPosition: 0,
  currentPosition: 0,
  latestBid: null,
  bidSequence: [],
  isBidding: false,
  partner: null,
  isTrumpBroken: false,
  playedCards: [],
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGameId(state: GameState, action: PayloadAction<string>) {
      state.gameId = action.payload;
    },
    setGameStatus(state: GameState, action: PayloadAction<GameStatus>) {
      state.status = action.payload;
    },
    setGamePlayerData(state: GameState, action: PayloadAction<PlayerData[]>) {
      state.players = action.payload;
    },
    setGameRoundNo(state: GameState, action: PayloadAction<number>) {
      state.roundNo = action.payload;
    },
    setGameUserPosition(state: GameState, action: PayloadAction<number>) {
      state.userPosition = action.payload;
    },
    setGameCurrentPosition(state: GameState, action: PayloadAction<number>) {
      state.currentPosition = action.payload;
    },
    setGameLatestBid(state: GameState, action: PayloadAction<Bid | null>) {
      state.latestBid = action.payload;
    },
    setGameBidSequence(state: GameState, action: PayloadAction<Bid[]>) {
      state.bidSequence = action.payload;
    },
    setGameIsBidding(state: GameState, action: PayloadAction<boolean>) {
      state.isBidding = action.payload;
    },
    setGamePartner(state: GameState, action: PayloadAction<Partner>) {
      state.partner = action.payload;
    },
    setGameIsTrumpBroken(state: GameState, action: PayloadAction<boolean>) {
      state.isTrumpBroken = action.payload;
    },
    setGamePlayedCards(state: GameState, action: PayloadAction<PlayedCard[]>) {
      state.playedCards = action.payload;
    },
    resetGame(state: GameState) {
      state.gameId = null;
      state.status = "stopped";
      state.userPosition = 0;
      state.currentPosition = 0;
      state.latestBid = null;
      state.bidSequence = [];
      state.isBidding = false;
      state.partner = null;
      state.isTrumpBroken = false;
      state.players = [];
      state.playedCards = [];
    },
  },
});

export const {
  setGameId,
  setGameStatus,
  setGamePlayerData,
  setGameRoundNo,
  setGameUserPosition,
  setGameCurrentPosition,
  setGameLatestBid,
  setGameBidSequence,
  setGameIsBidding,
  setGamePartner,
  setGameIsTrumpBroken,
  setGamePlayedCards,
  resetGame,
} = gameSlice.actions;

export const { reducer } = gameSlice;
