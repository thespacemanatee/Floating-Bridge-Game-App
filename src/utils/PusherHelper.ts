import type { MutableRefObject } from "react";
import { createRef } from "react";
import type { Channel } from "pusher-js";
import Pusher from "pusher-js";
import { AUTH_ENDPOINT, HOST, PUSHER_CLUSTER, PUSHER_KEY } from "@env";
import { batch } from "react-redux";

import type { Bid, Partner, Player, PlayerData } from "../store/features/game";
import {
  resetGame,
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
} from "../store/features/game";
import { store } from "../store";
import type { PlayedCard } from "../models";
import type { GameStatus } from "../store/features/room";
import {
  resetRoom,
  setGameExists,
  addPlayer,
  removePlayer,
  resetPlayers,
  setGameIsConnected,
  setGameStatus,
} from "../store/features/room";

import { getExistingGameExists } from ".";

export const pusherRef: MutableRefObject<Pusher | null> = createRef();
export const channelRef: MutableRefObject<Channel | null> = createRef();

type PusherStates =
  | "initialized"
  | "connecting"
  | "connected"
  | "unavailable"
  | "failed"
  | "disconnected";

console.log(HOST);

export const initPusherClient = (userId: string, username: string) => {
  pusherRef.current = new Pusher(PUSHER_KEY, {
    auth: {
      params: { userId, username },
    },
    authEndpoint: HOST + AUTH_ENDPOINT,
    cluster: PUSHER_CLUSTER,
  });
  pusherRef.current.connection.bind(
    "state_change",
    (states: { previous: PusherStates; current: PusherStates }) => {
      switch (states.current) {
        case "connected": {
          store.dispatch(setGameIsConnected(true));
          break;
        }
        default: {
          store.dispatch(setGameIsConnected(false));
        }
      }
    }
  );
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

export const bindPusherChannelEvents = () => {
  if (channelRef.current) {
    channelRef.current.bind("pusher:subscription_succeeded", async () => {
      store.dispatch(resetPlayers());
      await dispatchGameExists();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      channelRef.current?.members.each((player: Player) => {
        store.dispatch(addPlayer(player));
      });
    });
    channelRef.current.bind("pusher:member_added", async (player: Player) => {
      await dispatchGameExists();
      if (
        !store
          .getState()
          .room.players.some((thisPlayer) => thisPlayer.id === player.id)
      ) {
        store.dispatch(addPlayer(player));
      }
    });
    channelRef.current.bind("pusher:member_removed", async (player: Player) => {
      await dispatchGameExists();
      store.dispatch(removePlayer(player));
      store.dispatch(setGameStatus("stopped"));
    });
  } else {
    throw Error("Channel not found!");
  }
};

const dispatchGameExists = async () => {
  const { roomId } = store.getState().room;
  const { gameId } = store.getState().game;
  if (!roomId || !gameId) {
    return;
  }
  const exists = await getExistingGameExists(roomId, gameId);
  store.dispatch(setGameExists(exists));
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
      "client-game-status-event",
      (data: { status: GameStatus }) => {
        store.dispatch(setGameStatus(data.status));
      }
    );
    channelRef.current.bind(
      "game-init-event",
      (data: { gameId: string; gameData: GameData }) => {
        store.dispatch(setGameId(data.gameId));
        dispatchGameData(data.gameData);
      }
    );
    channelRef.current.bind(
      "game-turn-event",
      (data: { gameData: GameData }) => {
        dispatchGameData(data.gameData);
        if (data.gameData.roundNo >= 13) {
          store.dispatch(setGameStatus("ended"));
        }
      }
    );
  } else {
    throw Error("Channel not found!");
  }
};

export const triggerGameStartedLoading = () => {
  if (channelRef.current) {
    channelRef.current.trigger("client-game-status-event", {
      status: "loading",
    });
  } else {
    throw Error("Channel not found!");
  }
};

export const leaveRoom = () => {
  const { roomId } = store.getState().room;
  try {
    if (roomId) {
      unsubscribeToChannel(roomId);
    }
  } catch (err) {
    console.error(err);
  }
  batch(() => {
    store.dispatch(resetRoom());
    store.dispatch(resetGame());
  });
};

const dispatchGameData = (gameData: GameData) => {
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
