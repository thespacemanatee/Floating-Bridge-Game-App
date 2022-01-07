import { createRef, MutableRefObject } from "react";
import Pusher from "pusher-js";

export const pusherRef: MutableRefObject<Pusher | null> = createRef();
