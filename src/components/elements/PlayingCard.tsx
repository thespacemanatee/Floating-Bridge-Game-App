import { useMemo } from "react";
import type { ImageSourcePropType, StyleProp, ViewStyle } from "react-native";
import { Image, StyleSheet, View, useWindowDimensions } from "react-native";

import { CARD_ASPECT_RATIO } from "../../config/Constants";
import { ELEVATION, SPACING } from "../../resources";

export interface PlayingCardProps {
  image?: ImageSourcePropType;
  scaleSize?: number;
  style?: StyleProp<ViewStyle>;
}

export const PlayingCard = ({
  image,
  scaleSize = 1,
  style,
}: PlayingCardProps) => {
  const { width: wWidth } = useWindowDimensions();
  const { cardWidth, cardHeight } = useMemo(() => {
    const cWidth = wWidth * 0.06 * scaleSize;
    return {
      cardWidth: cWidth,
      cardHeight: cWidth * CARD_ASPECT_RATIO,
    };
  }, [wWidth, scaleSize]);
  return (
    <View
      style={[
        { borderRadius: image ? SPACING.spacing8 : SPACING.spacing20 },
        styles.container,
        style,
      ]}
    >
      <Image
        source={image || require("../../../assets/images/cards/BACK.svg")}
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
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: ELEVATION.elevation12,
  },
});
