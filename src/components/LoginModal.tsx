import React, { useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import Pusher from "pusher-js/react-native";
import { HOST, AUTH_ENDPOINT, PUSHER_KEY, PUSHER_CLUSTER } from "@env";

import { channelRef, pusherRef } from "../utils/PusherHelper";
import { SPACING } from "../resources/dimens";
import LobbyPage from "./elements/login_pages/LobbyPage";

const LoginModal = () => {
  const [modalVisible, setModalVisible] = useState(true);

  const enterRoom = (username: string, gameId: string) => {
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
    channelRef.current?.bind("game-event", (data: any) => {
      alert(JSON.stringify(data));
    });
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        alert("Modal has been closed.");
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.container}>
        <View style={styles.modalView}>
          <LobbyPage onEnterRoom={enterRoom} />
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
    padding: SPACING.spacing_48,
    alignItems: "center",
  },
});
