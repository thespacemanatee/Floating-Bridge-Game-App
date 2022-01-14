import React, { useEffect, useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { PlayCardPayload } from "../store/features/game";
import { setGameUserPosition, resetGame } from "../store/features/game";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  findCardFromHand,
  getHandPositions,
  triggerNextTurnEvent,
} from "../utils/GameHelper";
import { resetRoom } from "../store/features/room/roomSlice";
import { unsubscribeToChannel } from "../utils/PusherHelper";
import { SPACING } from "../resources/dimens";
import { BiddingModal } from "../components/modals/BiddingModal/BiddingModal";

import { Floor } from "./Floor";
import { CurrentPlayerHand } from "./CurrentPlayerHand";
import { OpponentHand } from "./OpponentHand";

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
  const { userPosition, top, left, right, bottom } = useMemo(
    () => getHandPositions(userId, gameHands),
    [gameHands, userId]
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setGameUserPosition(userPosition));
  }, [dispatch, userPosition]);

  const playCard = async (cardIndex: number) => {
    if (playedCards.length > 0) {
      const card = findCardFromHand(gameHands, gameCurrentPosition, cardIndex);
      return;
    }

    const payload: PlayCardPayload = {
      userId,
      position: gameCurrentPosition,
      cardIndex,
    };
    try {
      await triggerNextTurnEvent(roomId, payload, gameCurrentPosition);
    } catch (err) {
      console.error(err);
    }
  };

  const leaveRoom = () => {
    unsubscribeToChannel(roomId);
    dispatch(resetRoom());
    dispatch(resetGame());
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={leaveRoom} style={styles.closeButton}>
        <Ionicons name="close-outline" size={32} color="black" />
      </TouchableOpacity>
      <View style={styles.left}>
        {left.hand && <OpponentHand gameHand={left.hand} />}
      </View>
      <View style={styles.middle}>
        <View style={styles.top}>
          {top.hand && <OpponentHand gameHand={top.hand} />}
        </View>
        <Floor players={players} playedCards={playedCards} />
        <BiddingModal />
        <View style={styles.bottom}>
          {bottom.hand && (
            <CurrentPlayerHand
              gameHand={bottom.hand}
              isActive={gameUserPosition === gameCurrentPosition}
              onPlayCard={playCard}
            />
          )}
        </View>
      </View>
      <View style={styles.right}>
        {right.hand && <OpponentHand gameHand={right.hand} />}
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
