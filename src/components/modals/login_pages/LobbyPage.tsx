import React, { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { batch } from "react-redux";
import { nanoid } from "nanoid/non-secure";
import Clipboard from "@react-native-clipboard/clipboard";

import { FONT_SIZE, SPACING } from "../../../resources";
import { TextButton, RoomIdGenerateButton } from "../../molecules";
import { HeroImage, ThemedText, ThemedTextInput } from "../../elements";
import { useAppDispatch, useAppSelector } from "../../../store";
import { setGameRoomId, setGameUsername } from "../../../store/features/room";
import {
  bindGameEvents,
  bindPusherChannelEvents,
  initPusherClient,
  subscribeToChannel,
} from "../../../utils";
import { setGameRoundNo } from "../../../store/features/game";

export const LobbyPage = () => {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const userId = useAppSelector((state) => state.auth.userId);

  const dispatch = useAppDispatch();

  const generateGameId = () => {
    const id = nanoid(8);
    setRoomId(id);
    Clipboard.setString(id);
  };

  const enterRoom = useCallback(() => {
    if (!userId) {
      console.error("Missing userId for some reason...");
      return;
    }
    try {
      initPusherClient(userId, username);
      subscribeToChannel(roomId);
      bindPusherChannelEvents();
      bindGameEvents();
      batch(() => {
        dispatch(setGameRoundNo(0));
        dispatch(setGameUsername(username));
        dispatch(setGameRoomId(roomId));
      });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch, roomId, userId, username]);

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
        <RoomIdGenerateButton onPress={generateGameId} />
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
  loginButton: {
    margin: SPACING.spacing4,
    width: "100%",
  },
});
