import axios from "axios";
import { HOST } from "@env";

import type {
  Bid,
  GameHand,
  PlayCardPayload,
} from "../store/features/game/gameSlice";
import type { Card } from "../models";
import { store } from "../store";

export const initialiseGame = (userId: string, roomId: string) => {
  axios.post(HOST + "/games/init", {
    userId,
    roomId,
  });
};

export const triggerNextBidEvent = (
  roomId: string,
  bid: Bid,
  currentPosition: number
) => {
  const { bidSequence } = store.getState().game;
  axios.post(HOST + "/games/bid", {
    roomId,
    bid,
    bidSequence,
    currentPosition,
  });
};

export const triggerNextTurnEvent = (
  roomId: string,
  playCardPayload: PlayCardPayload,
  currentPosition: number
) => {
  axios.post(HOST + "/games/turn", {
    roomId,
    playCardPayload,
    currentPosition,
  });
};

export const getHandPositions = (userId: string, hands: GameHand[]) => {
  let currentUserIdx = 0;
  for (let i = 0; i < hands.length; i++) {
    if (hands[i]?.userId === userId) {
      currentUserIdx = i;
      break;
    }
  }
  return {
    userPosition: currentUserIdx % hands.length,
    bottom: {
      position: currentUserIdx % hands.length,
      hand: hands[currentUserIdx++ % hands.length],
    },
    left: {
      position: currentUserIdx % hands.length,
      hand: hands[currentUserIdx++ % hands.length],
    },
    top: {
      position: currentUserIdx % hands.length,
      hand: hands[currentUserIdx++ % hands.length],
    },
    right: {
      position: currentUserIdx % hands.length,
      hand: hands[currentUserIdx++ % hands.length],
    },
  };
};

export const findCardFromHand = (
  gameHands: GameHand[],
  position: number,
  cardIndex: number
) => {
  let card: Card | undefined;
  gameHands.forEach((hand, handIdx) => {
    if (handIdx === position) {
      card = hand.hand.find((_, cardIdx) => cardIdx === cardIndex);
    }
  });
  return card;
};
