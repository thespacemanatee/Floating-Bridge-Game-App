import React from "react";
import type { ImageStyle, StyleProp } from "react-native";
import { Image } from "react-native";

const IMAGE_HEIGHT = 250;
const IMAGE_WIDTH = 300;

type HeroImageProps = {
  style?: StyleProp<ImageStyle>;
};

export const HeroImage = ({ style }: HeroImageProps) => {
  return (
    <Image
      source={require("../../../assets/images/cards.png")}
      style={[{ width: IMAGE_WIDTH, height: IMAGE_HEIGHT }, style]}
    />
  );
};
