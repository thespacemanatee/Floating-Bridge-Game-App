import axios from "axios";
import { HOST } from "@env";

import type {
  GameHand,
  PlayCardPayload,
} from "../store/features/game/gameSlice";
import type { Card } from "../models";

export const initialiseGame = (userId: string, gameId: string) => {
  axios.post(HOST + "/game/init", {
    userId,
    channelName: `presence-${gameId}`,
  });
};

export const triggerNextTurnEvent = (
  roomId: string,
  playCardPayload: PlayCardPayload,
  currentPosition: number
) => {
  axios.post(HOST + "/game/turn", {
    channelName: `presence-${roomId}`,
    playCardPayload,
    currentPosition,
  });
};

export const getHandPositions = (userId: string, hands: GameHand[]) => {
  let currentUserIdx = 0;
  for (let i = 0; i < hands.length; i++) {
    if (hands[i]?.id === userId) {
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
