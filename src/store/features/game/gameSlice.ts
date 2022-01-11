import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import type { Card, CardSuit, PlayedCard } from "../../../models";

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
interface GameState {
  status: GameStatus;
  trump: CardSuit | null;
  level: number;
  userPosition: number;
  currentPosition: number;
  hands: GameHand[];
  playedCards: PlayedCards;
}

const initialState: GameState = {
  status: "stopped",
  trump: null,
  level: 0,
  userPosition: 0,
  currentPosition: 0,
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
    setGameUserPosition(state: GameState, action: PayloadAction<number>) {
      state.userPosition = action.payload;
    },
    setGameCurrentPosition(state: GameState, action: PayloadAction<number>) {
      state.currentPosition = action.payload;
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
      state.trump = null;
      state.level = 0;
      state.userPosition = 0;
      state.currentPosition = 0;
      state.hands = [];
      state.playedCards = [];
    },
  },
});

export const {
  setGameStatus,
  setGameUserPosition,
  setGameCurrentPosition,
  setGameHands,
  playCardFromHand,
  resetGame,
} = gameSlice.actions;

export const { reducer } = gameSlice;
