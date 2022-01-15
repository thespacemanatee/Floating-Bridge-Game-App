import React from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet, View } from "react-native";

import type { PlayerData } from "../store/features/game";
import { GameUserEntry } from "../components/molecules/GameUserEntry";

import { OpponentHand, WonSets } from ".";

type TopOpponentGroupProps = {
  playerData: PlayerData;
  active: boolean;
  style?: StyleProp<ViewStyle>;
};

export const TopOpponentGroup = ({
  playerData,
  active,
  style,
}: TopOpponentGroupProps) => {
  return (
    <View style={[styles.topContainer, style]}>
      <View style={styles.topHand}>
        <WonSets sets={playerData.sets} />
        <OpponentHand hand={playerData.hand} />
      </View>
      <GameUserEntry playerData={playerData} active={active} />
    </View>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
    alignItems: "center",
  },
  topHand: {
    flex: 1,
    alignItems: "center",
  },
});
