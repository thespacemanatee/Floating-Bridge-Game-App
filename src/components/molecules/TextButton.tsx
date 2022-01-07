import React from "react";
import { StyleSheet } from "react-native";

import { FONT_SIZE } from "../../resources/dimens";
import ThemedButton, { ThemedButtonProps } from "../elements/ThemedButton";
import ThemedText from "../elements/ThemedText";

interface TextButtonProps extends ThemedButtonProps {
  text: string;
  textColor?: string;
  size?: "tiny" | "small" | "default" | "large";
}

const textSize = {
  tiny: FONT_SIZE.tiny,
  small: FONT_SIZE.small,
  default: FONT_SIZE.medium,
  large: FONT_SIZE.large,
};

const TextButton = ({
  onPress,
  disabled,
  text,
  textColor,
  size,
  type,
  style,
}: TextButtonProps) => {
  return (
    <ThemedButton
      onPress={onPress}
      disabled={disabled}
      type={type}
      style={style}
    >
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
    </ThemedButton>
  );
};

export default TextButton;

const styles = StyleSheet.create({
  text: {
    fontFamily: "regular",
  },
});
