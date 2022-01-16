import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { nanoid } from "nanoid/non-secure";

import { FONT_SIZE, SPACING } from "../../../../resources/dimens";
import { TextButton } from "../../../molecules/TextButton";
import { HeroImage } from "../../../elements/HeroImage";
import { ThemedText } from "../../../elements/ThemedText";
import { ThemedTextInput } from "../../../elements/ThemedTextInput";
import { useAppDispatch } from "../../../../store/hooks";
import {
  setGameRoomId,
  setGameUsername,
} from "../../../../store/features/room/roomSlice";
import { ThemedButton } from "../../../elements";

export const LobbyPage = () => {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");

  const dispatch = useAppDispatch();

  const generateGameId = () => {
    setRoomId(nanoid(8));
  };

  const enterRoom = () => {
    dispatch(setGameUsername(username));
    dispatch(setGameRoomId(roomId));
  };

  return (
    <View style={styles.container}>
      <HeroImage />
      <ThemedText style={styles.titleText}>
        Welcome to Floating Bridge!
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
          onChangeText={setRoomId}
          value={roomId}
          style={styles.input}
        />
        <ThemedButton
          onPress={generateGameId}
          type="outlined"
          style={styles.generateButton}
        >
          <ThemedText>Generate</ThemedText>
        </ThemedButton>
      </View>
      <TextButton
        text="Enter Room"
        onPress={enterRoom}
        disabled={!username || !roomId}
        style={styles.loginButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.spacing32,
  },
  titleText: {
    fontFamily: "bold",
    fontSize: FONT_SIZE.title3,
    margin: SPACING.spacing12,
  },
  input: {
    width: "100%",
  },
  gameIdInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: SPACING.spacing12,
  },
  generateButton: {
    marginLeft: SPACING.spacing8,
  },
  loginButton: {
    margin: SPACING.spacing4,
    width: "100%",
  },
});
