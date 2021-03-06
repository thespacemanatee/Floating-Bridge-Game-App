import React, { useEffect, useMemo } from "react";
import { useWindowDimensions, StyleSheet } from "react-native";
import type { PanGestureHandlerGestureEvent } from "react-native-gesture-handler";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { snapPoint } from "react-native-redash";

import type { PlayingCardProps } from "../elements";
import { PlayingCard } from "../elements";

const DURATION = 150;

interface AnimatedFaceCardProps extends PlayingCardProps {
  index: number;
  offsetX: number;
  offsetY: number;
  offsetRotate: number;
  enabled?: boolean;
  onSnapToMiddle: (callback: () => void) => void;
}

export const AnimatedFaceCard = ({
  index,
  image,
  offsetX,
  offsetY,
  offsetRotate,
  enabled = true,
  onSnapToMiddle,
}: AnimatedFaceCardProps) => {
  const { height } = useWindowDimensions();
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(-height);
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const zIndex = useSharedValue(0);
  const midY = useMemo(() => -height / 2, [height]);
  const snapPointsY = useMemo(() => [midY, offsetY], [midY, offsetY]);
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

  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { x: number; y: number }
  >({
    onStart: (_, ctx) => {
      ctx.x = translateX.value;
      ctx.y = translateY.value;
      scale.value = withTiming(1.25);
      rotate.value = withTiming(0);
      zIndex.value = 1;
    },
    onActive: ({ translationX, translationY }, ctx) => {
      translateX.value = ctx.x + translationX;
      translateY.value = ctx.y + translationY;
    },
    onEnd: ({ velocityX, velocityY }) => {
      const destY = snapPoint(translateY.value, velocityY, snapPointsY);
      if (destY === midY) {
        translateX.value = withSpring(0, { velocity: velocityX });
        rotate.value = withTiming(-1 + Math.random() * 2);
        runOnJS(onSnapToMiddle)(() => {
          setTimeout(() => {
            translateX.value = withSpring(offsetX, { velocity: velocityX });
            translateY.value = withSpring(offsetY, { velocity: velocityY });
            rotate.value = withTiming(offsetRotate);
          }, 100);
        });
      } else {
        translateX.value = withSpring(offsetX, { velocity: velocityX });
        rotate.value = withTiming(offsetRotate);
      }
      translateY.value = withSpring(destY, { velocity: velocityY });
      scale.value = withTiming(1);
      zIndex.value = 0;
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotateX: "0deg" },
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate.value}rad` },
        { scale: scale.value },
      ],
      zIndex: zIndex.value,
    };
  });
  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      minDist={0}
      enabled={enabled}
    >
      <Animated.View
        style={[styles.card, animatedStyle]}
        pointerEvents="box-none"
      >
        <PlayingCard image={image} />
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  card: {
    position: "absolute",
  },
});
