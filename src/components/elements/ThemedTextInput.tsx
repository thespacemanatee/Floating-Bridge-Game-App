import type { TextInputProps } from "react-native";
import { StyleSheet, TextInput } from "react-native";

import { SPACING } from "../../resources";

export const ThemedTextInput = ({ style, ...props }: TextInputProps) => {
  return <TextInput style={[styles.input, style]} {...props} />;
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
