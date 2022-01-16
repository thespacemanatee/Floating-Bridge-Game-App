import axios from "axios";
import { HOST } from "@env";

import type { Bid, PlayCardPayload, Player } from "../store/features/game";
import type { CardSuit, CardValue } from "../models";

export const initialiseGame = async (
  userId: string,
  roomId: string,
  players: Player[]
) =>
  await axios.post(HOST + "/games/init", {
    userId,
    roomId,
    players,
  });

export const triggerNextBidEvent = async (gameId: string, bid?: Bid) =>
  await axios.post(HOST + "/games/bid", {
    gameId,
    bid,
  });

export const triggerSetPartnerEvent = async (
  gameId: string,
  partner: {
    suit: CardSuit;
    value: CardValue;
  }
) =>
  await axios.post(HOST + "/games/partner", {
    gameId,
    partner,
  });

export const triggerNextTurnEvent = async (
  gameId: string,
  playCardPayload: PlayCardPayload
) =>
  await axios.post(HOST + "/games/turn", {
    gameId,
    playCardPayload,
  });
