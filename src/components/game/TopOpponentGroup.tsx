import React, { memo } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet, View } from "react-native";
import isEqual from "lodash.isequal";

import type { PlayerData } from "../../store/features/game";
import { GameUserEntry } from "../molecules";

import { OpponentHand, WonSets } from ".";

type TopOpponentGroupProps = {
  playerData: PlayerData;
  active?: boolean;
  style?: StyleProp<ViewStyle>;
};

const areEqual = (prev: TopOpponentGroupProps, next: TopOpponentGroupProps) => {
  return (
    prev.active === next.active && isEqual(prev.playerData, next.playerData)
  );
};

export const TopOpponentGroup = memo(
  ({ playerData, active, style }: TopOpponentGroupProps) => {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.hand}>
          <WonSets sets={playerData.sets} />
          <OpponentHand hand={playerData.hand} />
        </View>
        {active !== undefined && (
          <GameUserEntry playerData={playerData} active={active} />
        )}
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
});
