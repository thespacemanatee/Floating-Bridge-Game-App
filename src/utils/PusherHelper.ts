import { createRef, MutableRefObject } from "react";
import Pusher, { Channel } from "pusher-js";

export const pusherRef: MutableRefObject<Pusher | null> = createRef();
export const channelRef: MutableRefObject<Channel | null> = createRef();
