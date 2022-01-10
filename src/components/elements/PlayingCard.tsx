import React, { useMemo } from "react";
import type { ImageSourcePropType, StyleProp, ViewStyle } from "react-native";
import { useWindowDimensions, View, StyleSheet, Image } from "react-native";

import { SPACING } from "../../resources/dimens";

export const FACE_CARD_ASPECT_RATIO = 1.4;

export interface PlayingCardProps {
  image: ImageSourcePropType;
  style?: StyleProp<ViewStyle>;
}

export const PlayingCard = ({ image, style }: PlayingCardProps) => {
  const { width: wWidth } = useWindowDimensions();
  const { cardWidth, cardHeight } = useMemo(() => {
    const cWidth = wWidth * 0.1;
    return {
      cardWidth: cWidth,
      cardHeight: cWidth * FACE_CARD_ASPECT_RATIO,
    };
  }, [wWidth]);
  return (
    <View style={[styles.container, style]}>
      <Image
        source={image}
        style={{
          width: cardWidth,
          height: cardHeight,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.48,
    shadowRadius: 11.95,
    elevation: 18,
    borderRadius: SPACING.spacing8,
  },
});
