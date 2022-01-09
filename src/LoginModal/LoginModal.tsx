import React, { useState } from "react";
import { Modal, StyleSheet, View } from "react-native";

import {
  bindMemberAddedEvent,
  bindMemberRemovedEvent,
  bindSubscriptionSucceededEvent,
  initPusherClient,
  subscribeToChannel,
} from "../utils/PusherHelper";
import { SPACING } from "../resources/dimens";
import LobbyPage from "./login_pages/LobbyPage";
import WaitingRoomPage from "./login_pages/WaitingRoomPage";
import { Member } from "../types/types";

const LoginModal = () => {
  const [modalVisible, setModalVisible] = useState(true);
  const [username, setUsername] = useState("");
  const [gameId, setGameId] = useState("");
  const [entered, setEntered] = useState(false);
  const [users, setUsers] = useState<Member[]>([]);

  const enterRoom = (username: string, gameId: string) => {
    if (!username || !gameId) {
      alert("Please enter the missing information!");
      return;
    }
    setUsername(username);
    setGameId(gameId);

    initPusherClient(username);
    subscribeToChannel(gameId);
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
    setEntered(true);
  };

  const startGame = () => {
    setModalVisible(false);
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={modalVisible}
      onRequestClose={() => {
        alert("Modal has been closed.");
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.container}>
        <View style={styles.modalView}>
          {entered ? (
            <WaitingRoomPage
              currentUsername={username}
              gameId={gameId}
              users={users}
              onStartGame={startGame}
            />
          ) : (
            <LobbyPage onEnterRoom={enterRoom} />
          )}
        </View>
      </View>
    </Modal>
  );
};

export default LoginModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00000099",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: SPACING.spacing_12,
    alignItems: "center",
  },
});
