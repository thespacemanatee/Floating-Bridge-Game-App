import React from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { Pressable, StyleSheet } from "react-native";

import { FONT_SIZE, SPACING } from "../../resources";
import type { BidLevel } from "../../store/features/game";

import { ThemedText } from "./ThemedText";

type LevelButtonProps = {
  level: BidLevel;
  selectedLevel?: BidLevel;
  onSelectLevel: (level: BidLevel) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const LevelButton = ({
  level,
  selectedLevel,
  onSelectLevel,
  disabled,
  style,
}: LevelButtonProps) => {
  const selectLevel = () => {
    onSelectLevel(level);
  };

  return (
    <Pressable
      onPress={selectLevel}
      disabled={disabled}
      style={({ pressed }) => [
        {
          backgroundColor:
            // eslint-disable-next-line no-nested-ternary
            disabled
              ? "grey"
              : // eslint-disable-next-line no-nested-ternary
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
      <ThemedText
        selectable={false}
        style={styles.levelText}
      >{`${level}`}</ThemedText>
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
