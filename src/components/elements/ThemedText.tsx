import React from "react";
import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";

type ThemedTextProps = {
  children?: string;
  selectable?: boolean;
  style?: StyleProp<TextStyle>;
};

const ThemedText = ({ children, selectable, style }: ThemedTextProps) => {
  return <Text selectable={selectable} style={[styles.text, style]}>{children}</Text>;
};

export default ThemedText;

const styles = StyleSheet.create({
  text: {
    fontFamily: "regular",
  },
});
