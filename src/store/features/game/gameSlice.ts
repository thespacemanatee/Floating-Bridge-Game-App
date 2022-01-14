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
  userPosition: number;
  currentPosition: number;
  latestBid: Bid | null;
  bidSequence: Bid[];
  isBidding: boolean;
  isPartnerChosen: boolean;
  hands: GameHand[];
  playedCards: PlayedCard[];
}

const initialState: GameState = {
  gameId: null,
  status: "stopped",
  userPosition: 0,
  currentPosition: 0,
  latestBid: null,
  bidSequence: [],
  isBidding: false,
  isPartnerChosen: false,
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
    setGameIsPartnerChosen(state: GameState, action: PayloadAction<boolean>) {
      state.isPartnerChosen = action.payload;
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
      state.gameId = null;
      state.status = "stopped";
      state.userPosition = 0;
      state.currentPosition = 0;
      state.latestBid = null;
      state.bidSequence = [];
      state.isBidding = false;
      state.isPartnerChosen = false;
      state.hands = [];
      state.playedCards = [];
    },
  },
});

export const {
  setGameId,
  setGameStatus,
  setGameUserPosition,
  setGameCurrentPosition,
  setGameLatestBid,
  setGameBidSequence,
  setGameIsBidding,
  setGameIsPartnerChosen,
  setGameHands,
  setGamePlayedCards,
  playCardFromHand,
  resetGame,
} = gameSlice.actions;

export const { reducer } = gameSlice;
