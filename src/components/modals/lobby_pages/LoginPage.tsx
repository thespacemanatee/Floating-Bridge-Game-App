import Clipboard from "@react-native-clipboard/clipboard";
import { nanoid } from "nanoid/non-secure";
import { useCallback, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { batch } from "react-redux";

import { FONT_SIZE, SPACING } from "../../../resources";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
  setGamePlayerData,
  setGameRoundNo,
} from "../../../store/features/game";
import {
  setGameRoomId,
  setGameStatus,
  setGameUsername,
} from "../../../store/features/room";
import {
  bindGameEvents,
  bindPusherChannelEvents,
  getSandboxPlayerData,
  initPusherClient,
  subscribeToChannel,
} from "../../../utils";
import { HeroImage, ThemedText, ThemedTextInput } from "../../elements";
import { RoomIdGenerateButton, TextButton } from "../../molecules";
import { Branding } from "../../molecules/Branding";

export const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const userId = useAppSelector((state) => state.auth.userId);

  const dispatch = useAppDispatch();

  const generateGameId = () => {
    const id = nanoid(8);
    setRoomId(id);
    Clipboard.setString(id);
  };

  const launchSandboxMode = async () => {
    const { data } = await getSandboxPlayerData();
    batch(() => {
      dispatch(setGamePlayerData(data));
      dispatch(setGameStatus("sandbox"));
    });
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
      <TouchableOpacity
        style={styles.sandboxContainer}
        onPress={launchSandboxMode}
      >
        <ThemedText style={styles.sandboxText}>Try in Sandbox mode!</ThemedText>
      </TouchableOpacity>
      <HeroImage style={styles.heroImage} />
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
      />
      <Branding />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.spacing32,
  },
  sandboxContainer: {
    alignSelf: "flex-end",
    marginBottom: SPACING.spacing16,
  },
  sandboxText: {
    color: "#0080FF",
    fontFamily: "semiBold",
  },
  heroImage: {
    marginHorizontal: SPACING.spacing64,
  },
  titleText: {
    fontFamily: "bold",
    fontSize: FONT_SIZE.title3,
    margin: SPACING.spacing16,
    alignSelf: "center",
  },
  input: {
    width: "100%",
  },
  gameIdInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: SPACING.spacing12,
  },
});
