import React from "react";
import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";

type ThemedTextProps = {
  children?: string;
  style?: StyleProp<TextStyle>;
};

const ThemedText = ({ children, style }: ThemedTextProps) => {
  return <Text style={[styles.text, style]}>{children}</Text>;
};

export default ThemedText;

const styles = StyleSheet.create({
  text: {
    fontFamily: "bold",
  },
});
