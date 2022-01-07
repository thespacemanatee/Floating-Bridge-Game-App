import React from "react";
import { StyleProp, StyleSheet, TextInput, TextStyle } from "react-native";

import { SPACING } from "../../resources/dimens";

type ThemedTextInputProps = {
  placeholder?: string;
  onChangeText?: (text: string) => void;
  value?: string;
  style?: StyleProp<TextStyle>;
};

const ThemedTextInput = ({
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

export default ThemedTextInput;

const styles = StyleSheet.create({
  input: {
    height: SPACING.spacing_48,
    padding: SPACING.spacing_12,
    borderRadius: SPACING.spacing_4,
    borderWidth: 1,
    backgroundColor: "#00000010",
  },
});
