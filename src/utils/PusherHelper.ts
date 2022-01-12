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
  PlayCardPayload,
  TrumpSuit,
} from "../store/features/game/gameSlice";
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
} from "../store/features/game/gameSlice";
import { store } from "../store";
import type { PlayedCard } from "../models";

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
  gameId: string;
  roomId: string;
  currentPosition: number;
  trump: TrumpSuit;
  level: BidLevel;
  latestBid: Bid | null;
  bidSequence: Bid[];
  isBidding: boolean;
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
    channelRef.current.bind("game-init-event", (data: GameData) => {
      store.dispatch(setGameId(data.gameId));
      store.dispatch(setGameCurrentPosition(data.currentPosition));
      store.dispatch(setGameTrump(data.trump));
      store.dispatch(setGameLevel(data.level));
      store.dispatch(setGameLatestBid(data.latestBid));
      store.dispatch(setGameBidSequence(data.bidSequence));
      store.dispatch(setGameIsBidding(data.isBidding));
      store.dispatch(setGameHands(data.hands));
      store.dispatch(setGamePlayedCards(data.playedCards));
    });
    channelRef.current.bind(
      "game-bid-event",
      (data: { gameData: GameData; winningBid?: Bid }) => {
        console.log(data);

        store.dispatch(setGameCurrentPosition(data.gameData.currentPosition));
        store.dispatch(setGameTrump(data.gameData.trump));
        store.dispatch(setGameLevel(data.gameData.level));
        store.dispatch(setGameBidSequence(data.gameData.bidSequence));
        store.dispatch(setGameLatestBid(data.gameData.latestBid));
        store.dispatch(setGameIsBidding(data.gameData.isBidding));
        store.dispatch(setGameHands(data.gameData.hands));
        store.dispatch(setGamePlayedCards(data.gameData.playedCards));
      }
    );
    channelRef.current.bind(
      "game-turn-event",
      (data: { playCardPayload: PlayCardPayload; nextPosition: number }) => {
        store.dispatch(setGameCurrentPosition(data.nextPosition));
        store.dispatch(playCardFromHand(data.playCardPayload));
      }
    );
  } else {
    throw Error("Channel not found!");
  }
};
