import React, { useMemo } from "react";
import type { GestureResponderEvent, StyleProp, ViewStyle } from "react-native";
import { Pressable, StyleSheet } from "react-native";

import { SPACING } from "../../resources";
export interface ThemedButtonProps {
  children?: React.ReactNode;
  onPress?: ((event: GestureResponderEvent) => void) | null;
  disabled?: boolean | null;
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
  pressed: "#00d000",
  default: "#00b000",
};

export const ThemedButton = ({
  children,
  onPress,
  disabled,
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
      disabled={disabled}
      style={({ pressed }) => [
        {
          // eslint-disable-next-line no-nested-ternary
          backgroundColor: disabled
            ? "grey"
            : pressed
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

const styles = StyleSheet.create({
  button: {
    padding: SPACING.spacing12,
    borderRadius: SPACING.spacing8,
    justifyContent: "center",
    alignItems: "center",
  },
});
