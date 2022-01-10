import React, { useCallback, useEffect, useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import { nanoid } from "nanoid/non-secure";

import {
  bindGameEvents,
  bindMemberAddedEvent,
  bindMemberRemovedEvent,
  bindSubscriptionSucceededEvent,
  initPusherClient,
  subscribeToChannel,
} from "../utils/PusherHelper";
import type { Member } from "../types";
import { SPACING } from "../resources/dimens";
import { initialiseGame } from "../utils/GameHelper";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  addPlayer,
  removePlayer,
  resetPlayers,
  setGameUserId,
  setIsAdmin,
} from "../store/features/room/roomSlice";

import { LobbyPage } from "./login_pages/LobbyPage";
import { WaitingRoomPage } from "./login_pages/WaitingRoomPage";

export const LoginModal = () => {
  const [modalVisible, setModalVisible] = useState(true);
  const gameUserId = useAppSelector((state) => state.room.userId);
  const gameUsername = useAppSelector((state) => state.room.username);
  const gameRoomId = useAppSelector((state) => state.room.roomId);
  const players = useAppSelector((state) => state.room.players);
  const gameStatus = useAppSelector((state) => state.game.status);

  const dispatch = useAppDispatch();

  const enterRoom = useCallback(
    (userId: string, username: string, roomId: string) => {
      initPusherClient(userId, username);
      subscribeToChannel(roomId);
      dispatch(resetPlayers());
      bindSubscriptionSucceededEvent((member: Member) => {
        dispatch(addPlayer(member));
      });
      bindMemberAddedEvent((member: Member) => {
        dispatch(addPlayer(member));
      });
      bindMemberRemovedEvent((member: Member) => {
        dispatch(removePlayer(member));
      });
      bindGameEvents();
    },
    [dispatch]
  );

  useEffect(() => {
    if (players[0]?.id === gameUserId) {
      dispatch(setIsAdmin(true));
    }
  }, [dispatch, gameUserId, players]);

  useEffect(() => {
    if (!gameUserId) {
      dispatch(setGameUserId(nanoid()));
    }
  }, [dispatch, gameUserId]);

  useEffect(() => {
    switch (gameStatus) {
      case "started": {
        setModalVisible(false);
        break;
      }
      case "stopped": {
        setModalVisible(true);
        break;
      }
    }
  }, [gameStatus]);

  useEffect(() => {
    if (gameUserId && gameUsername && gameRoomId) {
      enterRoom(gameUserId, gameUsername, gameRoomId);
    }
  }, [gameUserId, gameUsername, gameRoomId, enterRoom]);

  const startGame = () => {
    if (gameRoomId) {
      initialiseGame(gameUserId, gameRoomId);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.container}>
        <View style={styles.modalView}>
          {gameUserId && gameUsername && gameRoomId ? (
            <WaitingRoomPage players={players} onStartGame={startGame} />
          ) : (
            <LobbyPage />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00000099",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: SPACING.spacing12,
    alignItems: "center",
  },
});
