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
import { setGameUserId } from "../store/features/game/gameSlice";

import { LobbyPage } from "./login_pages/LobbyPage";
import { WaitingRoomPage } from "./login_pages/WaitingRoomPage";

export const LoginModal = () => {
  const [modalVisible, setModalVisible] = useState(true);
  const [users, setUsers] = useState<Member[]>([]);
  const gameStatus = useAppSelector((state) => state.game.status);
  const gameUserId = useAppSelector((state) => state.game.userId);
  const gameUsername = useAppSelector((state) => state.game.username);
  const gameRoomId = useAppSelector((state) => state.game.roomId);

  const dispatch = useAppDispatch();

  const enterRoom = useCallback(
    (username: string, roomId: string) => {
      let userId = gameUserId;
      if (!userId) {
        userId = nanoid();
        dispatch(setGameUserId(userId));
      }
      initPusherClient(userId, username);
      subscribeToChannel(roomId);
      setUsers([]);
      bindSubscriptionSucceededEvent((member: Member) => {
        setUsers((old) =>
          old.some((e) => e.id === member.id) ? old : [...old, member]
        );
      });
      bindMemberAddedEvent((member: Member) => {
        setUsers((old) =>
          old.some((e) => e.id === member.id) ? old : [...old, member]
        );
      });
      bindMemberRemovedEvent((member: Member) => {
        setUsers((old) => old.filter((e) => e.id !== member.id));
      });
      bindGameEvents();
    },
    [dispatch, gameUserId]
  );

  useEffect(() => {
    if (gameStatus === "started") {
      setModalVisible(false);
    }
  }, [gameStatus]);

  useEffect(() => {
    if (gameUsername && gameRoomId) {
      enterRoom(gameUsername, gameRoomId);
    }
  }, [enterRoom, gameRoomId, gameUsername]);

  const startGame = () => {
    if (gameRoomId) {
      initialiseGame(gameRoomId);
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
          {gameUsername && gameRoomId ? (
            <WaitingRoomPage users={users} onStartGame={startGame} />
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
