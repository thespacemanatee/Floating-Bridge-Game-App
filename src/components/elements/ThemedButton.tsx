import React, { useMemo } from "react";
import {
  GestureResponderEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";

import { SPACING } from "../../resources/dimens";
export interface ThemedButtonProps {
  children?: JSX.Element;
  onPress?: ((event: GestureResponderEvent) => void) | null;
  type?: "outlined" | "default";
  style?: StyleProp<ViewStyle>;
}

type ButtonColors = {
  pressed: string;
  default: string;
};

const outlinedColors: ButtonColors = {
  pressed: "#00000010",
  default: "transparent",
};

const defaultColors: ButtonColors = {
  pressed: "#5ce4ff",
  default: "#00d5ff",
};

const ThemedButton = ({
  children,
  onPress,
  type,
  style,
}: ThemedButtonProps) => {
  const buttonColors = useMemo(() => {
    switch (type) {
      case "outlined": {
        return outlinedColors;
      }
      default: {
        return defaultColors;
      }
    }
  }, [type]);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor: pressed
            ? buttonColors.pressed
            : buttonColors.default,
          borderWidth: type === "outlined" ? 1 : 0,
        },
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
