import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import type { Card, PlayedCard } from "../../../models";

export type GameStatus = "started" | "stopped";

export type GameHand = {
  id: string;
  hand: Card[];
};

export type PlayedCards = PlayedCard[];

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
  status: GameStatus;
  trump: TrumpSuit;
  level: BidLevel;
  startPosition: number;
  userPosition: number;
  currentPosition: number;
  bidSequence: Bid[];
  isBidding: boolean;
  hands: GameHand[];
  playedCards: PlayedCards;
}

const initialState: GameState = {
  status: "stopped",
  trump: "n",
  level: 1,
  startPosition: 0,
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
    setGameStatus(state: GameState, action: PayloadAction<GameStatus>) {
      state.status = action.payload;
    },
    setGameStartPosition(state: GameState, action: PayloadAction<number>) {
      state.startPosition = action.payload;
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
    playCardFromHand(state: GameState, action: PayloadAction<PlayCardPayload>) {
      const { userId, position, cardIndex } = action.payload;
      state.hands = state.hands.map((hand, handIdx) => {
        if (handIdx === position) {
          const newHand: GameHand = {
            id: hand.id,
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
      state.status = "stopped";
      state.trump = "n";
      state.level = 1;
      state.startPosition = 0;
      state.userPosition = 0;
      state.currentPosition = 0;
      state.bidSequence = [];
      state.hands = [];
      state.playedCards = [];
    },
  },
});

export const {
  setGameStatus,
  setGameStartPosition,
  setGameUserPosition,
  setGameCurrentPosition,
  setGameBidSequence,
  setGameIsBidding,
  setGameHands,
  playCardFromHand,
  resetGame,
} = gameSlice.actions;

export const { reducer } = gameSlice;
