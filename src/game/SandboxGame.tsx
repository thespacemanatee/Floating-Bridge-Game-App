import React from "react";
import { StyleSheet, View } from "react-native";

import { HorizontalOpponentGroup, TopOpponentGroup } from "../components/game";
import { CurrentPlayerGroup } from "../components/game/CurrentPlayerGroup";
import type { Card } from "../models";
import { useAppSelector } from "../store";

export const SandboxGame = () => {
  const players = useAppSelector((state) => state.game.players);

  const playCard = async (card: Card) => {};

  return (
    <>
      {players[0] && <TopOpponentGroup playerData={players[0]} />}
      <View style={styles.middle}>
        {players[1] && <HorizontalOpponentGroup playerData={players[1]} />}
        {players[2] && (
          <HorizontalOpponentGroup playerData={players[2]} mirrored />
        )}
      </View>
      {players[3] && (
        <CurrentPlayerGroup playerData={players[3]} onPlayCard={playCard} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  middle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
