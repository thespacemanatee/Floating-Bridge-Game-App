import type { TextProps } from "react-native";
import { StyleSheet, Text } from "react-native";

interface ThemedTextProps extends TextProps {
  selectable?: boolean;
}

export const ThemedText = ({
  children,
  selectable,
  style,
  ...props
}: ThemedTextProps) => {
  return (
    <Text selectable={selectable} style={[styles.text, style]} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: "regular",
  },
});
