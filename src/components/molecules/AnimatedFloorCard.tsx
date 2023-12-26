import { useEffect } from "react";
import type { ImageSourcePropType, StyleProp, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { PlayingCard } from "../elements";

type AnimatedFloorCardProps = {
  image?: ImageSourcePropType;
  style?: StyleProp<ViewStyle>;
};

export const AnimatedFloorCard = ({ image, style }: AnimatedFloorCardProps) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withSpring(1);
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: progress.value,
      },
    ],
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>
      <PlayingCard image={image} />
    </Animated.View>
  );
};
