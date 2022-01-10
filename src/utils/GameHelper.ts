import axios from "axios";
import { HOST } from "@env";

import type { GameHand } from "../store/features/game/gameSlice";

export const initialiseGame = (userId: string, gameId: string) => {
  axios.post(HOST + "/game/init", {
    userId,
    channelName: `presence-${gameId}`,
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
    bottom: {
      position: currentUserIdx++ % hands.length,
      hand: hands[currentUserIdx % hands.length],
    },
    left: {
      position: currentUserIdx++ % hands.length,
      hand: hands[currentUserIdx % hands.length],
    },
    top: {
      position: currentUserIdx++ % hands.length,
      hand: hands[currentUserIdx % hands.length],
    },
    right: {
      position: currentUserIdx++ % hands.length,
      hand: hands[currentUserIdx % hands.length],
    },
    userPosition: currentUserIdx % hands.length,
  };
};
