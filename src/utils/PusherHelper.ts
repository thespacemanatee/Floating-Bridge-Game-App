import { createRef, MutableRefObject } from "react";
import Pusher, { Channel } from "pusher-js";

import { Member } from "../types/types";
import { AUTH_ENDPOINT, HOST, PUSHER_CLUSTER, PUSHER_KEY } from "@env";


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
}

export const subscribeToChannel = (gameId: string) => {
  channelRef.current = pusherRef.current!.subscribe(`presence-${gameId}`);
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
