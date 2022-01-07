import React, { useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import { nanoid } from "nanoid";
import Pusher from "pusher-js/react-native";
import { HOST, AUTH_ENDPOINT, PUSHER_KEY, PUSHER_CLUSTER } from "@env";

import { FONT_SIZE, SPACING } from "../resources/dimens";
import HeroImage from "./elements/HeroImage";
import ThemedText from "./elements/ThemedText";
import ThemedTextInput from "./elements/ThemedTextInput";
import TextButton from "./molecules/TextButton";
import { pusherRef } from "../utils/PusherHelper";

const LoginModal = () => {
  const [modalVisible, setModalVisible] = useState(true);
  const [username, setUsername] = useState("");
  const [gameId, setGameId] = useState("");

  const enterRoom = () => {
    pusherRef.current = new Pusher(PUSHER_KEY, {
      auth: {
        params: {
          username: username,
        },
      },
      authEndpoint: HOST + AUTH_ENDPOINT,
      cluster: PUSHER_CLUSTER,
    });
    const channel = pusherRef.current?.subscribe(`presence-${gameId}`);
    channel?.bind("game-event", (data: any) => {
      alert(JSON.stringify(data));
    });
  };

  const generateGameId = () => {
    setGameId(nanoid(8));
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
          <HeroImage />
          <ThemedText style={styles.titleText}>
            Welcome to Singaporean Bridge!
          </ThemedText>
          <ThemedTextInput
            placeholder="Enter your username"
            onChangeText={setUsername}
            value={username}
            style={styles.input}
          />
          <View style={styles.gameIdInputContainer}>
            <ThemedTextInput
              placeholder="Enter your game room ID"
              onChangeText={setGameId}
              value={gameId}
              style={styles.input}
            />
            <TextButton
              onPress={generateGameId}
              text="Generate"
              type="outlined"
              size="tiny"
              style={styles.generateButton}
            />
          </View>
          <TextButton
            onPress={enterRoom}
            text="Enter Room"
            style={styles.loginButton}
          />
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
  titleText: {
    fontFamily: "bold",
    fontSize: FONT_SIZE.title3,
    margin: SPACING.spacing_12,
  },
  input: {
    width: "100%",
  },
  gameIdInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: SPACING.spacing_12,
  },
  generateButton: {
    marginLeft: SPACING.spacing_8,
  },
  loginButton: {
    margin: SPACING.spacing_4,
    width: "100%",
  },
});
