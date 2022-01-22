import React from "react";
import { Image } from "react-native";

const IMAGE_HEIGHT = 250;
const IMAGE_WIDTH = 300;

export const HeroImage = () => {
  return (
    <Image
      source={require("../../../assets/images/cards.png")}
      style={{ width: IMAGE_WIDTH, height: IMAGE_HEIGHT }}
    />
  );
};
