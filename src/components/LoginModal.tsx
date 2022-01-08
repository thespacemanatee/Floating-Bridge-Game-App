import React, { useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import Pusher from "pusher-js/react-native";
import { HOST, AUTH_ENDPOINT, PUSHER_KEY, PUSHER_CLUSTER } from "@env";

import { channelRef, pusherRef } from "../utils/PusherHelper";
import { SPACING } from "../resources/dimens";
import LobbyPage from "./elements/login_pages/LobbyPage";
import WaitingRoomPage from "./elements/login_pages/WaitingRoomPage";

export type Member = {
  id: string;
  info: {
    username: string;
    color: string;
  };
};

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

    pusherRef.current = new Pusher(PUSHER_KEY, {
      auth: {
        params: {
          username: username,
        },
      },
      authEndpoint: HOST + AUTH_ENDPOINT,
      cluster: PUSHER_CLUSTER,
    });
    channelRef.current = pusherRef.current?.subscribe(`presence-${gameId}`);
    channelRef.current.bind("pusher:subscription_succeeded", () => {
      channelRef.current?.members.each((member: Member) => {
        setUsers((old) => [...old, member]);
      });
    });
    channelRef.current.bind("pusher:member_added", (member: Member) => {
      setUsers((old) => [...old, member]);
    });
    channelRef.current.bind("pusher:member_removed", (member: Member) => {
      setUsers((old) => old.filter((e) => e.id !== member.id));
    });
    setEntered(true);
  };

  const startGame = () => {};

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
