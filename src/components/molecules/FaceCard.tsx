import React, { useEffect, useMemo } from "react";
import type { ImageSourcePropType, StyleProp, ViewStyle } from "react-native";
import { useWindowDimensions, View, StyleSheet, Image } from "react-native";
import type { PanGestureHandlerGestureEvent } from "react-native-gesture-handler";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  Easing,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { snapPoint } from "react-native-redash";

const CARD_WIDTH = 180;
const CARD_HEIGHT = 250;
const DURATION = 150;

type FaceCardProps = {
  index: number;
  image: ImageSourcePropType;
  offsetX: number;
  offsetY: number;
  offsetRotate: number;
  style?: StyleProp<ViewStyle>;
};

export const FaceCard = ({
  index,
  image,
  offsetX,
  offsetY,
  offsetRotate,
  style,
}: FaceCardProps) => {
  const { height } = useWindowDimensions();
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(-height);
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const midY = useMemo(() => -CARD_HEIGHT * 1.25, []);
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
      } else {
        translateX.value = withSpring(offsetX, { velocity: velocityX });
        rotate.value = withTiming(offsetRotate);
      }
      translateY.value = withSpring(destY, { velocity: velocityY });
      scale.value = withTiming(1);
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
    };
  });
  return (
    <View style={[styles.container, style]} pointerEvents="box-none">
      <PanGestureHandler onGestureEvent={onGestureEvent} minDist={0}>
        <Animated.View style={[styles.card, animatedStyle]}>
          <Image
            source={image}
            style={{
              width: CARD_WIDTH,
              height: CARD_HEIGHT,
            }}
          />
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-end",
    alignItems: "center",
    cursor: "pointer",
  },
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
