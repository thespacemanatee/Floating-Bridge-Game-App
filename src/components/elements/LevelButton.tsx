import React from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { Pressable, StyleSheet } from "react-native";

import { FONT_SIZE, SPACING } from "../../resources/dimens";
import type { BidLevel } from "../../store/features/game/gameSlice";

import { ThemedText } from "./ThemedText";

type LevelButtonProps = {
  level: BidLevel;
  selectedLevel?: BidLevel;
  onSelectLevel: (level: BidLevel) => void;
  style?: StyleProp<ViewStyle>;
};

export const LevelButton = ({
  level,
  selectedLevel,
  onSelectLevel,
  style,
}: LevelButtonProps) => {
  const selectLevel = () => {
    onSelectLevel(level);
  };

  return (
    <Pressable
      onPress={selectLevel}
      style={({ pressed }) => [
        {
          backgroundColor:
            // eslint-disable-next-line no-nested-ternary
            level === selectedLevel
              ? "#21b9ff"
              : pressed
              ? "#47c5ff"
              : "#80d7ff",
        },
        styles.container,
        style,
      ]}
    >
      <ThemedText style={styles.levelText}>{`${level}`}</ThemedText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.spacing12,
    paddingHorizontal: SPACING.spacing24,
    borderRadius: SPACING.spacing12,
  },
  levelText: {
    fontFamily: "semiBold",
    fontSize: FONT_SIZE.large,
  },
});
