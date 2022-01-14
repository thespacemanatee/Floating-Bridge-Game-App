import React from "react";
import { StyleSheet, View } from "react-native";

import { FONT_SIZE, SPACING } from "../../resources/dimens";
import type { Player } from "../../store/features/game";

import { ThemedText } from "./ThemedText";

type LobbyUserEntryProps = {
  currentUsername: string;
  player: Player;
};

export const LobbyUserEntry = ({
  currentUsername,
  player,
}: LobbyUserEntryProps) => {
  const { username, color } = player.info;
  return (
    <View style={styles.userContainer}>
      <View style={[{ backgroundColor: color }, styles.orbContainer]}>
        <ThemedText selectable={false} style={styles.orbText}>
          {username[0]?.toUpperCase()}
        </ThemedText>
      </View>
      <ThemedText style={[{ color }, styles.usernameText]}>
        {`${username}${username === currentUsername ? " (You)" : ""}`}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  userContainer: {
    flexDirection: "row",
    paddingVertical: SPACING.spacing8,
    alignItems: "center",
  },
  orbContainer: {
    height: SPACING.spacing48,
    width: SPACING.spacing48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: SPACING.spacing24,
    marginRight: SPACING.spacing24,
  },
  orbText: {
    color: "white",
    fontFamily: "semiBold",
    fontSize: FONT_SIZE.title3,
  },
  usernameText: {
    fontFamily: "medium",
    fontSize: FONT_SIZE.medium,
  },
});
