import type { MutableRefObject } from "react";
import { createRef } from "react";
import type { Channel } from "pusher-js";
import Pusher from "pusher-js";
import { AUTH_ENDPOINT, HOST, PUSHER_CLUSTER, PUSHER_KEY } from "@env";

import type { Member } from "../types";
import type {
  Bid,
  GameHand,
  GameStatus,
  PlayCardPayload,
} from "../store/features/game/gameSlice";
import {
  setGameLevel,
  setGameTrump,
  setGameIsBidding,
  setGameBidSequence,
  setGameStartPosition,
  playCardFromHand,
  setGameCurrentPosition,
  setGameHands,
  setGameStatus,
} from "../store/features/game/gameSlice";
import { store } from "../store";

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
      (data: {
        startUserId: string;
        hands: GameHand[];
        isBidding: boolean;
      }) => {
        const startPos = data.hands.findIndex((e) => e.id === data.startUserId);
        store.dispatch(setGameHands(data.hands));
        store.dispatch(setGameStartPosition(startPos));
        store.dispatch(setGameCurrentPosition(startPos));
        store.dispatch(setGameIsBidding(data.isBidding));
      }
    );
    channelRef.current.bind(
      "game-bid-event",
      (data: {
        bidSequence: Bid[];
        nextPosition: number;
        isBidding: boolean;
        winningBid?: Bid;
      }) => {
        store.dispatch(setGameBidSequence(data.bidSequence));
        store.dispatch(setGameCurrentPosition(data.nextPosition));
        store.dispatch(setGameIsBidding(data.isBidding));
        if (data.winningBid) {
          const { userId, suit, level } = data.winningBid;
          const { hands } = store.getState().game;
          const startPos =
            (hands.findIndex((e) => e.id === userId) + 1) % hands.length;
          store.dispatch(setGameCurrentPosition(startPos));
          store.dispatch(setGameTrump(suit!));
          store.dispatch(setGameLevel(level!));
        }
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
