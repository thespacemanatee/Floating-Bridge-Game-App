import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet, View } from "react-native";

import type { Card } from "../../models";
import type { PlayerData } from "../../store/features/game";
import { GameUserEntry } from "../molecules";

import { CurrentPlayerHand } from "./CurrentPlayerHand";
import { WonSets } from "./WonSets";

type CurrentPlayerGroupProps = {
  playerData: PlayerData;
  active?: boolean;
  onPlayCard?: (card: Card, callback: () => void) => void;
  style?: StyleProp<ViewStyle>;
};

export const CurrentPlayerGroup = ({
  playerData,
  active,
  onPlayCard,
  style,
}: CurrentPlayerGroupProps) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.hand}>
        <WonSets sets={playerData.sets} current />
        <CurrentPlayerHand
          hand={playerData.hand}
          isActive={active}
          onPlayCard={onPlayCard}
        />
      </View>
      {active !== undefined && (
        <GameUserEntry playerData={playerData} active={active} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column-reverse",
    alignItems: "center",
  },
  hand: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
});
