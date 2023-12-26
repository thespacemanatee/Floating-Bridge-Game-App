import type { StyleProp, ViewStyle } from "react-native";
import { ImageBackground, StyleSheet } from "react-native";

type GameBackgroundProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export const GameBackground = ({ children, style }: GameBackgroundProps) => {
  return (
    <ImageBackground
      source={{ uri: "https://dkqpv4xfvkxsw.cloudfront.net/background.jpg" }}
      style={[styles.container, style]}
    >
      {children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "darkgreen",
    overflow: "hidden",
  },
});
