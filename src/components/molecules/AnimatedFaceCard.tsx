import { useEffect, useMemo } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  runOnJS,
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
  const ctx = useSharedValue({ x: 0, y: 0 });
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

  const panGesture = Gesture.Pan()
    .onStart((_event) => {
      console.log("onStart", _event);

      ctx.value.x = translateX.value;
      ctx.value.y = translateY.value;
      scale.value = withTiming(1.25);
      rotate.value = withTiming(0);
      zIndex.value = 1;
    })
    .onUpdate((event) => {
      console.log("onUpdate", event);

      translateX.value = ctx.value.x + event.translationX;
      translateY.value = ctx.value.y + event.translationY;
    })
    .onEnd((event) => {
      console.log("onEnd", event);

      const destY = snapPoint(translateY.value, event.velocityY, snapPointsY);
      if (destY === midY) {
        translateX.value = withSpring(0, { velocity: event.velocityX });
        rotate.value = withTiming(-1 + Math.random() * 2);
        runOnJS(onSnapToMiddle)(() => {
          setTimeout(() => {
            translateX.value = withSpring(offsetX, {
              velocity: event.velocityX,
            });
            translateY.value = withSpring(offsetY, {
              velocity: event.velocityY,
            });
            rotate.value = withTiming(offsetRotate);
          }, 100);
        });
      } else {
        translateX.value = withSpring(offsetX, { velocity: event.velocityX });
        rotate.value = withTiming(offsetRotate);
      }
      translateY.value = withSpring(destY, { velocity: event.velocityY });
      scale.value = withTiming(1);
      zIndex.value = 0;
    })
    .enabled(enabled);

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
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[styles.card, animatedStyle]}
        pointerEvents="box-none"
      >
        <PlayingCard image={image} />
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  card: {
    position: "absolute",
  },
});
