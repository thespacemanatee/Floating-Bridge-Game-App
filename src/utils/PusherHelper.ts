import type { MutableRefObject } from "react";
import { createRef } from "react";
import type { Channel } from "pusher-js";
import Pusher from "pusher-js";
import { AUTH_ENDPOINT, HOST, PUSHER_CLUSTER, PUSHER_KEY } from "@env";

import type { Member } from "../types";
import type {
  Bid,
  BidLevel,
  GameHand,
  GameStatus,
  Partner,
  PlayCardPayload,
  TrumpSuit,
} from "../store/features/game";
import {
  setGameLatestBid,
  setGameId,
  setGamePlayedCards,
  setGameLevel,
  setGameTrump,
  setGameIsBidding,
  setGameBidSequence,
  playCardFromHand,
  setGameCurrentPosition,
  setGameHands,
  setGameStatus,
} from "../store/features/game";
import { store } from "../store";
import type { PlayedCard } from "../models";
import { setGamePartner } from "../store/features/game/gameSlice";

export const pusherRef: MutableRefObject<Pusher | null> = createRef();
export const channelRef: MutableRefObject<Channel | null> = createRef();

export const initPusherClient = (userId: string, username: string) => {
  pusherRef.current = new Pusher(PUSHER_KEY, {
    auth: {
      params: { userId, username },
    },
    authEndpoint: HOST + AUTH_ENDPOINT,
    cluster: PUSHER_CLUSTER,
  });
};

export const subscribeToChannel = (gameId: string) => {
  if (pusherRef.current) {
    channelRef.current = pusherRef.current.subscribe(`presence-${gameId}`);
  } else {
    throw Error("Pusher client not initialised!");
  }
};

export const unsubscribeToChannel = (gameId: string) => {
  if (pusherRef.current) {
    pusherRef.current.unsubscribe(`presence-${gameId}`);
  } else {
    throw Error("Pusher client not initialised!");
  }
};

export const bindSubscriptionSucceededEvent = (
  callback: (member: Member) => void
) => {
  if (channelRef.current) {
    channelRef.current.bind("pusher:subscription_succeeded", () => {
      channelRef.current?.members.each(callback);
    });
  } else {
    throw Error("Channel not found!");
  }
};

export const bindMemberAddedEvent = (callback: (member: Member) => void) => {
  if (channelRef.current) {
    channelRef.current.bind("pusher:member_added", callback);
  } else {
    throw Error("Channel not found!");
  }
};

export const bindMemberRemovedEvent = (callback: (member: Member) => void) => {
  if (channelRef.current) {
    channelRef.current.bind("pusher:member_removed", callback);
  } else {
    throw Error("Channel not found!");
  }
};

type GameData = {
  roomId: string;
  currentPosition: number;
  trump: TrumpSuit;
  level: BidLevel;
  latestBid: Bid | null;
  bidSequence: Bid[];
  isBidding: boolean;
  partner: Partner;
  hands: GameHand[];
  playedCards: PlayedCard[];
};

export const bindGameEvents = () => {
  if (channelRef.current) {
    channelRef.current.bind(
      "game-status-event",
      (data: { status: GameStatus }) => {
        store.dispatch(setGameStatus(data.status));
      }
    );
    channelRef.current.bind(
      "game-init-event",
      (data: { gameId: string; gameData: GameData }) => {
        store.dispatch(setGameId(data.gameId));
        setGameData(data.gameData);
      }
    );
    channelRef.current.bind(
      "game-turn-event",
      (data: { gameData: GameData }) => {
        setGameData(data.gameData);
      }
    );
  } else {
    throw Error("Channel not found!");
  }
};

const setGameData = (gameData: GameData) => {
  const {
    currentPosition,
    trump,
    level,
    latestBid,
    bidSequence,
    isBidding,
    partner,
    hands,
    playedCards,
  } = gameData;
  store.dispatch(setGameCurrentPosition(currentPosition));
  store.dispatch(setGameTrump(trump));
  store.dispatch(setGameLevel(level));
  store.dispatch(setGameLatestBid(latestBid));
  store.dispatch(setGameBidSequence(bidSequence));
  store.dispatch(setGameIsBidding(isBidding));
  store.dispatch(setGamePartner(partner));
  store.dispatch(setGameHands(hands));
  store.dispatch(setGamePlayedCards(playedCards));
};
