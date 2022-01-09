import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { nanoid } from "nanoid/non-secure";

import { FONT_SIZE, SPACING } from "../../resources/dimens";
import { TextButton } from "../../components/molecules/TextButton";
import HeroImage from "../../components/elements/HeroImage";
import { ThemedText } from "../../components/elements/ThemedText";
import { ThemedTextInput } from "../../components/elements/ThemedTextInput";

type LobbyPageProps = {
  onEnterRoom: (username: string, gameId: string) => void;
};

export const LobbyPage = ({ onEnterRoom }: LobbyPageProps) => {
  const [username, setUsername] = useState("");
  const [gameId, setGameId] = useState("");

  const generateGameId = () => {
    setGameId(nanoid(8));
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
          onChangeText={setGameId}
          value={gameId}
          style={styles.input}
        />
        <TextButton
          onPress={generateGameId}
          text="Generate"
          textColor="black"
          type="outlined"
          size="tiny"
          style={styles.generateButton}
        />
      </View>
      <TextButton
        onPress={() => onEnterRoom(username, gameId)}
        text="Enter Room"
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
