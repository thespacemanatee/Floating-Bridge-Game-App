import React from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";

import type { PlayerData } from "../store/features/game";
import { GameUserEntry } from "../components/molecules/GameUserEntry";

import { OpponentHand, WonSets } from ".";

type OpponentGroup = {
  playerData: PlayerData;
  mirrored?: boolean;
};

export const OpponentGroup = ({ playerData, mirrored }: OpponentGroup) => {
  const { width, height } = useWindowDimensions();
  return (
    <View style={styles.container}>
      <GameUserEntry playerData={playerData} />
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
};

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
