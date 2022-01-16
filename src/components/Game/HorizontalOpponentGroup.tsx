import React, { memo } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import isEqual from "lodash.isequal";

import type { PlayerData } from "../../store/features/game";
import { GameUserEntry } from "../molecules/GameUserEntry";

import { OpponentHand, WonSets } from ".";

type HorizontalOpponentGroupProps = {
  playerData: PlayerData;
  active: boolean;
  mirrored?: boolean;
  style?: StyleProp<ViewStyle>;
};

const areEqual = (
  prev: HorizontalOpponentGroupProps,
  next: HorizontalOpponentGroupProps
) => {
  return (
    prev.active === next.active && isEqual(prev.playerData, next.playerData)
  );
};

export const HorizontalOpponentGroup = memo(
  ({ playerData, active, mirrored, style }: HorizontalOpponentGroupProps) => {
    const { width, height } = useWindowDimensions();

    return (
      <View style={[styles.container, style]}>
        <GameUserEntry
          playerData={playerData}
          active={active}
          style={styles.player}
        />
        <View
          style={[
            {
              transform: [
                { translateX: (-width / 4 + height / 6) * (mirrored ? -1 : 1) },
                { rotate: `${90 + (mirrored ? 0 : 180)}deg` },
              ],
            },
            styles.hand,
          ]}
        >
          <WonSets sets={playerData.sets} />
          <OpponentHand hand={playerData.hand} />
        </View>
      </View>
    );
  },
  areEqual
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  hand: {
    flex: 1,
    alignItems: "center",
  },
  player: {
    zIndex: 10,
  },
});
