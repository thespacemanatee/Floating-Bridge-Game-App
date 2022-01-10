import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { deck } from "../models/deck";
import { SPACING } from "../resources/dimens";
import type { GameHand } from "../store/features/game/gameSlice";
import { playCardFromHand } from "../store/features/game/gameSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { PlayingCard } from "../components/elements/PlayingCard";
import { ThemedText } from "../components/elements/ThemedText";
import { AnimatedBackCard } from "../components/molecules/AnimatedBackCard";
import { AnimatedFaceCard } from "../components/molecules/AnimatedFaceCard";
import { Floor } from "./Floor";

const CARD_OFFSET_X = 75;
const BACK_CARD_OFFSET_X = 50;
const CARD_OFFSET_Y = 2.5;
const CARD_ROTATION = 0.75;

export const Game = () => {
  const userId = useAppSelector((state) => state.game.userId);
  const players = useAppSelector((state) => state.game.players);
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

  const dispatch = useAppDispatch();

  const playCard = (position: number, cardIndex: number) => {
    if (userId) {
      dispatch(playCardFromHand({ userId, position, cardIndex }));
    }
  };

  const renderBackCards = (gameHand: GameHand) => {
    return gameHand?.hand.map((card, index, hand) => {
      const noOfCards = hand.length;
      const translateX =
        BACK_CARD_OFFSET_X * (index - Math.floor(noOfCards / 2));
      const translateY =
        -CARD_OFFSET_Y * Math.pow(index - Math.floor(noOfCards / 2), 2);
      const rotate =
        -CARD_ROTATION * ((index - Math.floor(noOfCards / 2)) / noOfCards);
      return (
        <AnimatedBackCard
          key={`${card.suit}${card.value}`}
          index={index}
          offsetX={translateX}
          offsetY={translateY}
          offsetRotate={rotate}
        />
      );
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text>Left: {left?.id}</Text>
        {left && renderBackCards(left)}
      </View>
      <View style={styles.middle}>
        <View style={styles.top}>
          <Text>Top: {top?.id}</Text>
          {top && renderBackCards(top)}
        </View>
        <Floor players={players} playedCards={playedCards} />
        <View style={styles.bottom}>
          <Text>Bottom: {bottom?.id}</Text>
          {bottom?.hand.map((card, index, hand) => {
            const noOfCards = hand.length;
            const translateX =
              CARD_OFFSET_X * (index - Math.floor(noOfCards / 2));
            const translateY =
              CARD_OFFSET_Y * Math.pow(index - Math.floor(noOfCards / 2), 2);
            const rotate =
              CARD_ROTATION * ((index - Math.floor(noOfCards / 2)) / noOfCards);
            return (
              <AnimatedFaceCard
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
        {right && renderBackCards(right)}
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
    transform: [{ rotate: "270deg" }],
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
    transform: [{ rotate: "90deg" }],
  },
});
