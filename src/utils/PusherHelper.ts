import type { MutableRefObject } from "react";
import { createRef } from "react";
import type { Channel } from "pusher-js";
import Pusher from "pusher-js";
import { AUTH_ENDPOINT, HOST, PUSHER_CLUSTER, PUSHER_KEY } from "@env";
import { batch } from "react-redux";

import type {
  Bid,
  GameStatus,
  Partner,
  Player,
  PlayerData,
} from "../store/features/game";
import {
  setGamePartner,
  setGameRoundNo,
  setGameIsTrumpBroken,
  setGameLatestBid,
  setGameId,
  setGamePlayedCards,
  setGameIsBidding,
  setGameBidSequence,
  setGameCurrentPosition,
  setGamePlayerData,
  setGameStatus,
} from "../store/features/game";
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
  callback: (player: Player) => void
) => {
  if (channelRef.current) {
    channelRef.current.bind("pusher:subscription_succeeded", () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      channelRef.current?.members.each(callback);
    });
  } else {
    throw Error("Channel not found!");
  }
};

export const bindPlayerAddedEvent = (callback: (player: Player) => void) => {
  if (channelRef.current) {
    channelRef.current.bind("pusher:member_added", callback);
  } else {
    throw Error("Channel not found!");
  }
};

export const bindPlayerRemovedEvent = (callback: (player: Player) => void) => {
  if (channelRef.current) {
    channelRef.current.bind("pusher:member_removed", callback);
  } else {
    throw Error("Channel not found!");
  }
};

type GameData = {
  roomId: string;
  players: PlayerData[];
  roundNo: number;
  currentPosition: number;
  latestBid: Bid | null;
  bidSequence: Bid[];
  isBidding: boolean;
  partner: Partner;
  isTrumpBroken: boolean;
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
    players,
    roundNo,
    currentPosition,
    latestBid,
    bidSequence,
    isBidding,
    partner,
    isTrumpBroken,
    playedCards,
  } = gameData;
  batch(() => {
    store.dispatch(setGamePlayerData(players));
    store.dispatch(setGameRoundNo(roundNo));
    store.dispatch(setGameCurrentPosition(currentPosition));
    store.dispatch(setGameLatestBid(latestBid));
    store.dispatch(setGameBidSequence(bidSequence));
    store.dispatch(setGameIsBidding(isBidding));
    store.dispatch(setGamePartner(partner));
    store.dispatch(setGameIsTrumpBroken(isTrumpBroken));
    store.dispatch(setGamePlayedCards(playedCards));
  });
};
