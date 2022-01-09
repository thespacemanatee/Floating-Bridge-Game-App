import React from "react";
import type { ImageSourcePropType, StyleProp, ViewStyle } from "react-native";
import { StyleSheet, View, Image } from "react-native";

const CARD_WIDTH = 216;
const CARD_HEIGHT = 300;

type FaceCardProps = {
  image: ImageSourcePropType;
  style?: StyleProp<ViewStyle>;
};

export const FaceCard = ({ image, style }: FaceCardProps) => {
  return (
    <View style={[style, styles.card]}>
      <Image
        source={image}
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
    borderRadius: 8,
  },
});
