import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import type { Card, PlayedCard } from "../../../models";

export type GameStatus = "started" | "stopped";

export type GameHand = {
  userId: string;
  hand: Card[];
};

export type PlayCardPayload = {
  userId: string;
  position: number;
  cardIndex: number;
};

export type TrumpSuit = "c" | "d" | "h" | "s" | "n";

export type BidLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type Bid = {
  userId: string;
  suit?: TrumpSuit;
  level?: BidLevel;
};

interface GameState {
  gameId?: string;
  status: GameStatus;
  trump: TrumpSuit;
  level: BidLevel;
  userPosition: number;
  currentPosition: number;
  bidSequence: Bid[];
  isBidding: boolean;
  hands: GameHand[];
  playedCards: PlayedCard[];
}

const initialState: GameState = {
  status: "stopped",
  trump: "c",
  level: 1,
  userPosition: 0,
  currentPosition: 0,
  bidSequence: [],
  isBidding: false,
  hands: [],
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
    setGameTrump(state: GameState, action: PayloadAction<TrumpSuit>) {
      state.trump = action.payload;
    },
    setGameLevel(state: GameState, action: PayloadAction<BidLevel>) {
      state.level = action.payload;
    },
    setGameUserPosition(state: GameState, action: PayloadAction<number>) {
      state.userPosition = action.payload;
    },
    setGameCurrentPosition(state: GameState, action: PayloadAction<number>) {
      state.currentPosition = action.payload;
    },
    setGameBidSequence(state: GameState, action: PayloadAction<Bid[]>) {
      state.bidSequence = action.payload;
    },
    setGameIsBidding(state: GameState, action: PayloadAction<boolean>) {
      state.isBidding = action.payload;
    },
    setGameHands(state: GameState, action: PayloadAction<GameHand[]>) {
      state.hands = action.payload;
    },
    setGamePlayedCards(state: GameState, action: PayloadAction<PlayedCard[]>) {
      state.playedCards = action.payload;
    },
    playCardFromHand(state: GameState, action: PayloadAction<PlayCardPayload>) {
      const { userId, position, cardIndex } = action.payload;
      state.hands = state.hands.map((hand, handIdx) => {
        if (handIdx === position) {
          const newHand: GameHand = {
            userId: hand.userId,
            hand: hand.hand.filter((card, cardIdx) => {
              if (cardIdx === cardIndex) {
                const playedCard: PlayedCard = {
                  ...card,
                  playedBy: userId,
                };
                state.playedCards = [...state.playedCards, playedCard];
              }
              return cardIdx !== cardIndex;
            }),
          };
          return newHand;
        }
        return hand;
      });
    },
    resetGame(state: GameState) {
      state.gameId = undefined;
      state.status = "stopped";
      state.trump = "n";
      state.level = 1;
      state.userPosition = 0;
      state.currentPosition = 0;
      state.bidSequence = [];
      state.hands = [];
      state.playedCards = [];
    },
  },
});

export const {
  setGameId,
  setGameStatus,
  setGameTrump,
  setGameLevel,
  setGameUserPosition,
  setGameCurrentPosition,
  setGameBidSequence,
  setGameIsBidding,
  setGameHands,
  setGamePlayedCards,
  playCardFromHand,
  resetGame,
} = gameSlice.actions;

export const { reducer } = gameSlice;
