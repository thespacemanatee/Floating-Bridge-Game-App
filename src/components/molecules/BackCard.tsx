import React from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet } from "react-native";

import { SPACING } from "../../resources/dimens";
import { PlayingCard } from "../elements/PlayingCard";

export interface BackCardProps {
  style?: StyleProp<ViewStyle>;
}

export const BackCard = ({ style }: BackCardProps) => {
  return (
    <PlayingCard
      image={require("../../../assets/images/cards/BACK.svg")}
      style={[style, styles.container]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: SPACING.spacing20,
  },
});
