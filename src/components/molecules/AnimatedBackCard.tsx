import React, { useEffect, useMemo } from "react";
import { useWindowDimensions, StyleSheet } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import type { BackCardProps } from "./BackCard";
import { BackCard } from "./BackCard";

const DURATION = 150;

interface AnimatedBackCardProps extends BackCardProps {
  index: number;
  offsetX: number;
  offsetY: number;
  offsetRotate: number;
}

export const AnimatedBackCard = ({
  index,
  offsetX,
  offsetY,
  offsetRotate,
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
      })
    );
    translateY.value = withDelay(
      delay,
      withTiming(offsetY, {
        duration: DURATION,
        easing: Easing.inOut(Easing.ease),
      })
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
      style={[styles.card, animatedStyle]}
      pointerEvents="box-none"
    >
      <BackCard />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    position: "absolute",
  },
});
