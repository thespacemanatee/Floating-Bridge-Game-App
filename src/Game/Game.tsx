import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { deck } from "../models/deck";
import { GameHand, resetGame } from "../store/features/game/gameSlice";
import { playCardFromHand } from "../store/features/game/gameSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { AnimatedBackCard } from "../components/molecules/AnimatedBackCard";
import { AnimatedFaceCard } from "../components/molecules/AnimatedFaceCard";
import { getHandPositions } from "../utils/GameHelper";
import { resetRoom } from "../store/features/room/roomSlice";
import { unsubscribeToChannel } from "../utils/PusherHelper";

import { Floor } from "./Floor";
import { SPACING } from "../resources/dimens";

const CARD_OFFSET_X = 75;
const BACK_CARD_OFFSET_X = 50;
const CARD_OFFSET_Y = 2.5;
const CARD_ROTATION = 0.75;

export const Game = () => {
  const userId = useAppSelector((state) => state.room.userId);
  const roomId = useAppSelector((state) => state.room.roomId);
  const players = useAppSelector((state) => state.room.players);
  const gameHands = useAppSelector((state) => state.game.hands);
  const playedCards = useAppSelector((state) => state.game.playedCards);
  const { top, left, right, bottom, currentPosition } = useMemo(
    () => getHandPositions(userId, gameHands),
    [gameHands, userId]
  );

  const dispatch = useAppDispatch();

  const playCard = (position: number, cardIndex: number) => {
    if (userId) {
      dispatch(playCardFromHand({ userId, position, cardIndex }));
    }
  };

  const leaveRoom = () => {
    if (roomId) {
      unsubscribeToChannel(roomId);
    }
    dispatch(resetRoom());
    dispatch(resetGame());
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
      <TouchableOpacity onPress={leaveRoom} style={styles.closeButton}>
        <Ionicons name="close-outline" size={32} color="black" />
      </TouchableOpacity>
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
                onSnapToMiddle={(cardIdx) => playCard(currentPosition, cardIdx)}
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
  closeButton: {
    position: "absolute",
    height: SPACING.spacing48,
    width: SPACING.spacing48,
    borderRadius: SPACING.spacing24,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    margin: SPACING.spacing16,
    zIndex: 1,
  },
  left: {
    alignItems: "center",
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
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "90deg" }],
  },
});
