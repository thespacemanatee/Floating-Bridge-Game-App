import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { deck } from "../models/deck";
import { playCardFromHand } from "../store/features/game/gameSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

import { FaceCard } from "./molecules/FaceCard";

const CARD_OFFSET_X = 75;
const CARD_OFFSET_Y = 2.5;
const CARD_ROTATION = 0.75;

export const Game = () => {
  const userId = useAppSelector((state) => state.game.userId);
  const gameHands = useAppSelector((state) => state.game.hands);
  const playedCards = useAppSelector((state) => state.game.playedCards);
  const { top, left, right, bottom } = useMemo(
    () =>
      gameHands
        ? {
            top: gameHands[0],
            left: gameHands[1],
            right: gameHands[2],
            bottom: gameHands[3],
          }
        : {},
    [gameHands]
  );

  console.log(playedCards);

  const dispatch = useAppDispatch();

  const playCard = (position: number, cardIndex: number) => {
    console.log(`Removing card: ${position}:${cardIndex}`);
    if (userId) {
      dispatch(playCardFromHand({ userId, position, cardIndex }));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text>Left: {left?.id}</Text>
        {left?.id === userId && <Text>(You)</Text>}
      </View>
      <View style={styles.middle}>
        <View style={styles.top}>
          <Text>Top: {top?.id}</Text>
          {top?.id === userId && <Text>(You)</Text>}
        </View>
        <View style={styles.bottom}>
          <Text>Bottom: {bottom?.id}</Text>
          {bottom?.id === userId && <Text>(You)</Text>}
          {bottom?.hand.map((card, index) => {
            const noOfCards = bottom?.hand.length;
            const translateX =
              CARD_OFFSET_X * (index - Math.floor(noOfCards / 2));
            const translateY =
              CARD_OFFSET_Y * Math.pow(index - Math.floor(noOfCards / 2), 2);
            const rotate =
              CARD_ROTATION * ((index - Math.floor(noOfCards / 2)) / noOfCards);
            return (
              <FaceCard
                index={index}
                key={`${card.suit}${card.value}`}
                image={deck[`${card.suit}${card.value}`].imageUri}
                offsetX={translateX}
                offsetY={translateY}
                offsetRotate={rotate}
                onSnapToMiddle={(cardIdx) => playCard(3, cardIdx)}
              />
            );
          })}
        </View>
      </View>
      <View style={styles.right}>
        <Text>Right: {right?.id}</Text>
        {right?.id === userId && <Text>(You)</Text>}
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
    justifyContent: "flex-end",
  },
  right: {
    justifyContent: "center",
  },
});
