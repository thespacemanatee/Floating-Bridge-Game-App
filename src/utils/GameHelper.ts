import axios from "axios";
import { HOST } from "@env";

import type { GameHand } from "../store/features/game/gameSlice";

export const initialiseGame = (gameId: string) => {
  axios.post(HOST + "/game/init", {
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
    bottom: hands[currentUserIdx++ % hands.length],
    left: hands[currentUserIdx++ % hands.length],
    top: hands[currentUserIdx++ % hands.length],
    right: hands[currentUserIdx++ % hands.length],
    currentPosition: currentUserIdx % hands.length,
  };
};
