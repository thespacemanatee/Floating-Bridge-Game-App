import React from "react";
import {
  GestureResponderEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";

import { SPACING } from "../../resources/dimens";

type ThemedButton = {
  children: JSX.Element;
  onPress?: ((event: GestureResponderEvent) => void) | null;
  style?: StyleProp<ViewStyle>;
};

const ThemedButton = ({ children, onPress, style }: ThemedButton) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        { backgroundColor: pressed ? "#5ce4ff" : "#00d5ff" },
        styles.button,
        style,
      ]}
    >
      {children}
    </Pressable>
  );
};

export default ThemedButton;

const styles = StyleSheet.create({
  button: {
    padding: SPACING.spacing_12,
    borderRadius: SPACING.spacing_8,
    justifyContent: "center",
    alignItems: "center",
  },
});
