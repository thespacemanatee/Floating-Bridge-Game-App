import type { MutableRefObject } from "react";
import { createRef } from "react";
import type { Channel } from "pusher-js";
import Pusher from "pusher-js";
import { AUTH_ENDPOINT, HOST, PUSHER_CLUSTER, PUSHER_KEY } from "@env";

import type { Member } from "../types";
import type { GameHand, GameStatus } from "../store/features/game/gameSlice";
import { setGameHands, setGameStatus } from "../store/features/game/gameSlice";
import { store } from "../store";

export const pusherRef: MutableRefObject<Pusher | null> = createRef();
export const channelRef: MutableRefObject<Channel | null> = createRef();

export const initPusherClient = (username: string) => {
  pusherRef.current = new Pusher(PUSHER_KEY, {
    auth: {
      params: {
        username: username,
      },
    },
    authEndpoint: HOST + AUTH_ENDPOINT,
    cluster: PUSHER_CLUSTER,
  });
};

export const subscribeToChannel = (gameId: string) => {
  channelRef.current = pusherRef.current!.subscribe(`presence-${gameId}`);
};

export const unsubscribeToChannel = (gameId: string) => {
  pusherRef.current?.unsubscribe(`presence-${gameId}`);
};

export const bindSubscriptionSucceededEvent = (
  callback: (member: Member) => void
) => {
  channelRef.current?.bind("pusher:subscription_succeeded", () => {
    channelRef.current?.members.each(callback);
  });
};

export const bindMemberAddedEvent = (callback: (member: Member) => void) => {
  channelRef.current?.bind("pusher:member_added", callback);
};

export const bindMemberRemovedEvent = (callback: (member: Member) => void) => {
  channelRef.current?.bind("pusher:member_removed", callback);
};

export const bindGameEvents = () => {
  channelRef.current?.bind(
    "game-status-event",
    (data: { status: GameStatus }) => {
      store.dispatch(setGameStatus(data.status));
    }
  );
  channelRef.current?.bind("game-init-event", (data: { hands: GameHand[] }) => {
    store.dispatch(setGameHands(data.hands));
  });
};
