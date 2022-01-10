import React from "react";
import type { StyleProp, TextStyle } from "react-native";
import { StyleSheet, Text } from "react-native";

type ThemedTextProps = {
  children?: string;
  selectable?: boolean;
  style?: StyleProp<TextStyle>;
};

export const ThemedText = ({
  children,
  selectable,
  style,
}: ThemedTextProps) => {
  return (
    <Text selectable={selectable} style={[styles.text, style]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: "regular",
  },
});
