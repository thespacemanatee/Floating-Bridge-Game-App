import React, { useMemo } from "react";
import type { PressableProps } from "react-native";
import { Pressable, StyleSheet } from "react-native";

import { SPACING } from "../../resources";

export interface ThemedButtonProps extends PressableProps {
  type?: "outlined" | "default";
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
  disabled,
  type,
  style,
  ...props
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
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
      {...props}
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
