import React, { useEffect, useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { deck } from "../models/deck";
import type { GameHand } from "../store/features/game/gameSlice";
import {
  setGameUserPosition,
  resetGame,
  playCardFromHand,
} from "../store/features/game/gameSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { AnimatedBackCard } from "../components/molecules/AnimatedBackCard";
import { AnimatedFaceCard } from "../components/molecules/AnimatedFaceCard";
import { getHandPositions } from "../utils/GameHelper";
import { resetRoom } from "../store/features/room/roomSlice";
import { unsubscribeToChannel } from "../utils/PusherHelper";
import { SPACING } from "../resources/dimens";
import { ThemedText } from "../components/elements/ThemedText";

import { Floor } from "./Floor";

const CARD_OFFSET_X = 75;
const BACK_CARD_OFFSET_X = 50;
const CARD_OFFSET_Y = 2.5;
const CARD_ROTATION = 0.75;

export const Game = () => {
  const userId = useAppSelector((state) => state.room.userId);
  const roomId = useAppSelector((state) => state.room.roomId);
  const players = useAppSelector((state) => state.room.players);
  const gameUserPosition = useAppSelector((state) => state.game.userPosition);
  const gameCurrentPosition = useAppSelector(
    (state) => state.game.currentPosition
  );
  const gameHands = useAppSelector((state) => state.game.hands);
  const playedCards = useAppSelector((state) => state.game.playedCards);
  const { top, left, right, bottom, userPosition } = useMemo(
    () => getHandPositions(userId, gameHands),
    [gameHands, userId]
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setGameUserPosition(userPosition));
  }, [dispatch, userPosition]);

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
        {left.hand && renderBackCards(left.hand)}
        <View style={{ padding: 50, backgroundColor: "white", zIndex: 1 }}>
          <ThemedText>{`Position: ${left.position}`}</ThemedText>
        </View>
      </View>
      <View style={styles.middle}>
        <View style={styles.top}>
          {top.hand && renderBackCards(top.hand)}
          <View style={{ padding: 50, backgroundColor: "white", zIndex: 1 }}>
            <ThemedText>{`Position: ${top.position}`}</ThemedText>
          </View>
        </View>
        <Floor players={players} playedCards={playedCards} />
        <View style={styles.bottom}>
          {bottom.hand?.hand.map((card, index, hand) => {
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
                enabled={gameUserPosition === gameCurrentPosition}
                onSnapToMiddle={(cardIdx) => playCard(userPosition, cardIdx)}
              />
            );
          })}
          <View style={{ padding: 50, backgroundColor: "white", zIndex: 1 }}>
            <ThemedText>{`Position: ${bottom.position}`}</ThemedText>
          </View>
        </View>
      </View>
      <View style={styles.right}>
        {right.hand && renderBackCards(right.hand)}
        <View style={{ padding: 50, backgroundColor: "white", zIndex: 1 }}>
          <ThemedText>{`Position: ${right.position}`}</ThemedText>
        </View>
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },
  left: {
    flex: 0.1,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "270deg" }],
  },
  top: {
    flex: 1,
    alignItems: "center",
  },
  middle: {
    flex: 0.8,
  },
  bottom: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  right: {
    flex: 0.1,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "90deg" }],
  },
});
