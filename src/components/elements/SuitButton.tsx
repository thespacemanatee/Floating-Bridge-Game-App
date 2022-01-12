import React from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { Pressable, StyleSheet } from "react-native";

import { FONT_SIZE, SPACING } from "../../resources/dimens";
import type { BidLevel, TrumpSuit } from "../../store/features/game/gameSlice";

import { ThemedText } from "./ThemedText";

type SuitButtonProps = {
  suit: TrumpSuit;
  selectedSuit?: TrumpSuit;
  onSelectSuit: (level: TrumpSuit) => void;
  style?: StyleProp<ViewStyle>;
};

export const SuitButton = ({
  suit,
  selectedSuit,
  onSelectSuit,
  style,
}: SuitButtonProps) => {
  const selectSuit = () => {
    onSelectSuit(suit);
  };

  return (
    <Pressable
      onPress={selectSuit}
      style={({ pressed }) => [
        {
          backgroundColor:
            // eslint-disable-next-line no-nested-ternary
            suit === selectedSuit ? "#d66eff" : pressed ? "#db80ff" : "#e8b0ff",
        },
        styles.container,
        style,
      ]}
    >
      <ThemedText style={styles.suitText}>{`${suit}`}</ThemedText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.spacing12,
    paddingHorizontal: SPACING.spacing24,
    borderRadius: SPACING.spacing12,
  },
  suitText: {
    fontFamily: "semiBold",
    fontSize: FONT_SIZE.large,
  },
});