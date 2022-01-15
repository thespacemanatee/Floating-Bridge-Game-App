import React, { useEffect } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { SPACING } from "../../resources/dimens";
import type { PlayerData } from "../../store/features/game";
import { UserEntry } from "../elements";

type GameUserEntryProps = {
  playerData: PlayerData;
  active: boolean;
  style?: StyleProp<ViewStyle>;
};

const BOB_DURATION = 2000;
const BOB_OFFSET = 10;

export const GameUserEntry = ({
  playerData,
  active,
  style,
}: GameUserEntryProps) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (active) {
      progress.value = withRepeat(
        withTiming(1, { duration: BOB_DURATION }),
        -1,
        true
      );
    }
  }, [active, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          progress.value,
          [0, 1],
          [-BOB_OFFSET, BOB_OFFSET]
        ),
      },
    ],
    borderWidth: active ? 4 : 0,
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      ["#ff4242", "#ffffff"]
    ),
  }));

  return (
    <Animated.View style={[styles.playerContainer, animatedStyle, style]}>
      <UserEntry player={playerData} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  playerContainer: {
    backgroundColor: "white",
    paddingHorizontal: SPACING.spacing12,
    borderRadius: SPACING.spacing8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,
    elevation: 15,
  },
});
