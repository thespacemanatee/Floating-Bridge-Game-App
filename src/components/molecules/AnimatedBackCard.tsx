import { useEffect, useMemo } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import type { PlayingCardProps } from "../elements";
import { PlayingCard } from "../elements";

const DURATION = 150;

interface AnimatedBackCardProps extends PlayingCardProps {
  index: number;
  offsetX: number;
  offsetY: number;
  offsetRotate: number;
}

export const AnimatedBackCard = ({
  index,
  image,
  scaleSize,
  offsetX,
  offsetY,
  offsetRotate,
  style,
}: AnimatedBackCardProps) => {
  const { height } = useWindowDimensions();
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(-height);
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const delay = useMemo(() => index * DURATION, [index]);

  useEffect(() => {
    translateX.value = withDelay(
      delay,
      withTiming(offsetX, {
        duration: DURATION,
        easing: Easing.inOut(Easing.ease),
      }),
    );
    translateY.value = withDelay(
      delay,
      withTiming(offsetY, {
        duration: DURATION,
        easing: Easing.inOut(Easing.ease),
      }),
    );
    rotate.value = withDelay(delay - 100, withTiming(offsetRotate));
  }, [
    delay,
    index,
    offsetRotate,
    offsetX,
    offsetY,
    rotate,
    translateX,
    translateY,
  ]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotateX: "0deg" },
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate.value}rad` },
        { scale: scale.value },
      ],
    };
  });
  return (
    <Animated.View
      style={[styles.card, animatedStyle, style]}
      pointerEvents="box-none"
    >
      <PlayingCard image={image} scaleSize={scaleSize} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    position: "absolute",
  },
});
