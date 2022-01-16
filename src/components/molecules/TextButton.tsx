import React from "react";
import { StyleSheet, View } from "react-native";

import { FONT_SIZE } from "../../resources/dimens";
import type { ThemedButtonProps } from "../elements/ThemedButton";
import { ThemedButton } from "../elements/ThemedButton";
import { ThemedText } from "../elements/ThemedText";

interface TextButtonProps extends ThemedButtonProps {
  text: string;
  textColor?: string;
  size?: "tiny" | "small" | "default" | "large";
  rightComponent?: () => React.ReactNode;
}

const textSize = {
  tiny: FONT_SIZE.tiny,
  small: FONT_SIZE.small,
  default: FONT_SIZE.medium,
  large: FONT_SIZE.large,
};

export const TextButton = ({
  onPress,
  disabled,
  text,
  textColor,
  size,
  type,
  rightComponent,
  style,
}: TextButtonProps) => {
  return (
    <ThemedButton
      onPress={onPress}
      disabled={disabled}
      type={type}
      style={[styles.button, style]}
    >
      <View style={styles.contentContainer}>
        <ThemedText
          selectable={false}
          style={[
            {
              fontSize: textSize[size || "default"],
              color: textColor || "white",
            },
            styles.text,
          ]}
        >
          {text}
        </ThemedText>
        {rightComponent && (
          <View style={styles.rightComponent}>{rightComponent()}</View>
        )}
      </View>
    </ThemedButton>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: "semiBold",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
  },
  rightComponent: {
    position: "absolute",
    alignSelf: "flex-end",
  },
});
