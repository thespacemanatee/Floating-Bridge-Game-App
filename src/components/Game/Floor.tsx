import React from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet, View } from "react-native";

import { PlayingCard, ThemedText } from "../elements";
import type { PlayedCard } from "../../models";
import { DECK } from "../../models";
import { SPACING } from "../../resources";
import { useAppSelector } from "../../store";

type FloorProps = {
  playedCards: PlayedCard[];
  style?: StyleProp<ViewStyle>;
};

export const Floor = ({ playedCards, style }: FloorProps) => {
  const players = useAppSelector((state) => state.game.players);

  return (
    <View style={[styles.container, style]}>
      {playedCards.map((card) => {
        const currPlayer = players.find(
          (player) => player.id === card.playedBy
        );

        return (
          currPlayer && (
            <View
              key={`${card.suit}${card.value}`}
              style={styles.playedCardContainer}
            >
              <View style={styles.cardContainer}>
                <PlayingCard
                  image={DECK[`${card.suit}${card.value}`].imageUri}
                />
              </View>
              <View
                style={[
                  { backgroundColor: currPlayer.info.color || "white" },
                  styles.nameContainer,
                ]}
              >
                <ThemedText style={styles.nameText}>
                  {currPlayer.info.username}
                </ThemedText>
              </View>
            </View>
          )
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  playedCardContainer: {
    marginHorizontal: SPACING.spacing8,
  },
  cardContainer: {
    alignItems: "center",
  },
  nameContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: SPACING.spacing8,
    padding: SPACING.spacing8,
    borderRadius: SPACING.spacing8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  nameText: {
    fontFamily: "semiBold",
  },
});
