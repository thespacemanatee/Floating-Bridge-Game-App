import React from "react";
import { StyleSheet, TextInput } from "react-native";
import type { StyleProp, TextStyle } from "react-native";

import { SPACING } from "../../resources";

type ThemedTextInputProps = {
  placeholder?: string;
  onChangeText?: (text: string) => void;
  value?: string;
  style?: StyleProp<TextStyle>;
};

export const ThemedTextInput = ({
  placeholder,
  onChangeText,
  value,
  style,
}: ThemedTextInputProps) => {
  return (
    <TextInput
      placeholder={placeholder}
      onChangeText={onChangeText}
      value={value}
      style={[styles.input, style]}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: SPACING.spacing48,
    padding: SPACING.spacing12,
    borderRadius: SPACING.spacing4,
    borderWidth: 1,
    backgroundColor: "#00000010",
  },
});
