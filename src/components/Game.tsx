import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { deck } from "../models/deck";
import { useAppSelector } from "../store/hooks";

import { FaceCard } from "./FaceCard";

const HAND_SIZE = 13;
const CARD_OFFSET_X = 75;
const CARD_OFFSET_Y = 2.5;
const CARD_ROTATION = 0.75;

export const Game = () => {
  const gameUserId = useAppSelector((state) => state.game.userId);
  const gameHands = useAppSelector((state) => state.game.hands);

  const { top, left, right, bottom } = useMemo(() => {
    if (gameHands) {
      return {
        top: gameHands[0],
        left: gameHands[1],
        right: gameHands[2],
        bottom: gameHands[3],
      };
    }
    return {};
  }, [gameHands]);

  if (gameHands === null) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text>Left: {left?.id}</Text>
        {left?.id === gameUserId && <Text>(You)</Text>}
      </View>
      <View style={styles.middle}>
        <View style={styles.top}>
          <Text>Top: {top?.id}</Text>
          {top?.id === gameUserId && <Text>(You)</Text>}
        </View>
        <View style={styles.bottom}>
          <Text>Bottom: {bottom?.id}</Text>
          {bottom?.id === gameUserId && <Text>(You)</Text>}
          {bottom?.hand.map((card, index) => {
            const noOfCards = bottom?.hand.length || HAND_SIZE;
            const translateX =
              CARD_OFFSET_X * (index - Math.floor(noOfCards / 2));
            const translateY =
              CARD_OFFSET_Y * Math.pow(index - Math.floor(noOfCards / 2), 2);
            const rotate = `${
              CARD_ROTATION * ((index - Math.floor(noOfCards / 2)) / noOfCards)
            }rad`;
            return (
              <FaceCard
                key={`${card.suit}${card.value}`}
                image={deck[`${card.suit}${card.value}`].imageUri}
                style={{
                  transform: [{ translateX }, { translateY }, { rotate }],
                }}
              />
            );
          })}
        </View>
      </View>
      <View style={styles.right}>
        <Text>Right: {right?.id}</Text>
        {right?.id === gameUserId && <Text>(You)</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "green",
    overflow: "hidden",
  },
  left: {
    justifyContent: "center",
  },
  top: {
    flex: 1,
    alignItems: "center",
  },
  middle: {
    flex: 1,
  },
  bottom: {
    flex: 1,
    alignItems: "center",
  },
  right: {
    justifyContent: "center",
  },
});
