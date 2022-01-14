import axios from "axios";
import { HOST } from "@env";

import type {
  Bid,
  GameHand,
  Partner,
  PlayCardPayload,
} from "../store/features/game";
import type { Card } from "../models";

export const initialiseGame = async (userId: string, roomId: string) =>
  await axios.post(HOST + "/games/init", {
    userId,
    roomId,
  });

export const triggerNextBidEvent = async (gameId: string, bid?: Bid) =>
  await axios.post(HOST + "/games/bid", {
    gameId,
    bid,
  });

export const triggerNextTurnEvent = async (
  gameId: string,
  playCardPayload: PlayCardPayload,
  currentPosition: number
) =>
  await axios.post(HOST + "/games/turn", {
    gameId,
    playCardPayload,
    currentPosition,
  });

export const triggerSetPartnerEvent = async (
  gameId: string,
  partner: Partner
) =>
  await axios.post(HOST + "games/partner", {
    gameId,
    partner,
  });

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
