import { createRef, MutableRefObject } from "react";
import Pusher, { Channel } from "pusher-js";

import { Member } from "../components/LoginModal";

export const pusherRef: MutableRefObject<Pusher | null> = createRef();
export const channelRef: MutableRefObject<Channel | null> = createRef();

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
