import React, { useCallback, useEffect, useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import { nanoid } from "nanoid/non-secure";

import {
  bindGameEvents,
  bindPlayerAddedEvent,
  bindPlayerRemovedEvent,
  bindSubscriptionSucceededEvent,
  initialiseGame,
  initPusherClient,
  subscribeToChannel,
} from "../../../utils";
import { SPACING } from "../../../resources/dimens";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  addPlayer,
  removePlayer,
  resetPlayers,
  setGameUserId,
} from "../../../store/features/room/roomSlice";
import type { Player } from "../../../store/features/game";

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
      bindSubscriptionSucceededEvent((player: Player) => {
        dispatch(addPlayer(player));
      });
      bindPlayerAddedEvent((player: Player) => {
        dispatch(addPlayer(player));
      });
      bindPlayerRemovedEvent((player: Player) => {
        dispatch(removePlayer(player));
      });
      bindGameEvents();
    },
    [dispatch]
  );

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

  const startGame = async () => {
    if (gameRoomId) {
      await initialiseGame(gameUserId, gameRoomId, players);
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: "50%",
  },
});
