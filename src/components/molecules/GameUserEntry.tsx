import React from "react";
import { StyleSheet, View } from "react-native";

import { SPACING } from "../../resources/dimens";
import type { PlayerData } from "../../store/features/game";
import { UserEntry } from "../elements";

type GameUserEntryProps = {
  playerData: PlayerData;
};

export const GameUserEntry = ({ playerData }: GameUserEntryProps) => {
  return (
    <View style={styles.playerContainer}>
      <UserEntry player={playerData} />
    </View>
  );
};

const styles = StyleSheet.create({
  playerContainer: {
    backgroundColor: "white",
    marginLeft: SPACING.spacing36,
    paddingHorizontal: SPACING.spacing12,
    borderRadius: SPACING.spacing8,
  },
});
