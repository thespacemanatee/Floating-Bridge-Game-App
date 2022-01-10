import React from "react";
import { StyleSheet, View } from "react-native";

import { PlayingCard } from "../components/elements/PlayingCard";
import { ThemedText } from "../components/elements/ThemedText";
import type { PlayedCard } from "../models/deck";
import { deck } from "../models/deck";
import { SPACING } from "../resources/dimens";
import type { Member } from "../types";

type FloorProps = {
  players: Member[];
  playedCards: PlayedCard[];
};

export const Floor = ({ players, playedCards }: FloorProps) => {
  return (
    <View style={styles.container}>
      {playedCards.map((card) => {
        return (
          <View key={`${card.suit}${card.value}`} style={styles.cardContainer}>
            <PlayingCard image={deck[`${card.suit}${card.value}`].imageUri} />
            <ThemedText>
              {
                players.find((player) => player.id === card.playedBy)?.info
                  .username
              }
            </ThemedText>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
  },
  cardContainer: {
    marginHorizontal: SPACING.spacing8,
  },
});
