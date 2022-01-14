import React from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { Pressable, StyleSheet } from "react-native";

import { FONT_SIZE, SPACING } from "../../resources/dimens";
import type { TrumpSuit } from "../../store/features/game";
import { getUnicodeCharacter } from "../../utils/utils";

import { ThemedText } from "./ThemedText";

type SuitButtonProps = {
  suit: TrumpSuit;
  selectedSuit?: TrumpSuit;
  onSelectSuit: (level: TrumpSuit) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const SuitButton = ({
  suit,
  selectedSuit,
  onSelectSuit,
  disabled,
  style,
}: SuitButtonProps) => {
  const selectSuit = () => {
    onSelectSuit(suit);
  };

  return (
    <Pressable
      onPress={selectSuit}
      disabled={disabled}
      style={({ pressed }) => [
        {
          backgroundColor:
            // eslint-disable-next-line no-nested-ternary
            disabled
              ? "grey"
              : // eslint-disable-next-line no-nested-ternary
              suit === selectedSuit
              ? "#d66eff"
              : pressed
              ? "#db80ff"
              : "#e8b0ff",
        },
        styles.container,
        style,
      ]}
    >
      <ThemedText selectable={false} style={styles.suitText}>
        {getUnicodeCharacter(suit)}
      </ThemedText>
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
