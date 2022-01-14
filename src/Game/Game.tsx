import React, { useEffect, useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { PlayCardPayload } from "../store/features/game";
import { setGameUserPosition, resetGame } from "../store/features/game";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { getHandPositions, triggerNextTurnEvent } from "../utils/GameHelper";
import { resetRoom } from "../store/features/room/roomSlice";
import { unsubscribeToChannel } from "../utils/PusherHelper";
import { SPACING } from "../resources/dimens";
import { BiddingModal } from "../components/modals/BiddingModal/BiddingModal";
import type { Card } from "../models";

import { Floor } from "./Floor";
import { CurrentPlayerHand } from "./CurrentPlayerHand";
import { OpponentHand } from "./OpponentHand";

export const Game = () => {
  const userId = useAppSelector((state) => state.room.userId);
  const roomId = useAppSelector((state) => state.room.roomId);
  const gameId = useAppSelector((state) => state.game.gameId);
  const players = useAppSelector((state) => state.game.players);
  const gameUserPosition = useAppSelector((state) => state.game.userPosition);
  const gameCurrentPosition = useAppSelector(
    (state) => state.game.currentPosition
  );
  const latestBid = useAppSelector((state) => state.game.latestBid);
  const isTrumpBroken = useAppSelector((state) => state.game.isTrumpBroken);
  const playedCards = useAppSelector((state) => state.game.playedCards);
  const { userPosition, top, left, right, currentPlayerData } = useMemo(
    () => getHandPositions(userId, players),
    [players, userId]
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (userPosition) {
      dispatch(setGameUserPosition(userPosition));
    }
  }, [dispatch, userPosition]);

  const playCard = async (card: Card, callback: () => void) => {
    if (
      !isTrumpBroken &&
      playedCards.length === 0 &&
      card.suit === latestBid?.trump
    ) {
      callback();
      alert("You cannot start with the trump card!");
      return;
    }

    if (
      currentPlayerData?.playerData?.hand.some(
        (c) => c.suit === playedCards[0]?.suit
      ) &&
      card.suit !== playedCards[0]?.suit
    ) {
      callback();
      alert(`You must finish throwing ${playedCards[0]?.suit.toUpperCase()}!`);
      return;
    }

    const payload: PlayCardPayload = {
      userId,
      card,
    };
    try {
      if (gameId) {
        await triggerNextTurnEvent(gameId, payload);
      }
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
        {left?.playerData && <OpponentHand playerData={left.playerData} />}
      </View>
      <View style={styles.middle}>
        <View style={styles.top}>
          {top?.playerData && <OpponentHand playerData={top.playerData} />}
        </View>
        <Floor playedCards={playedCards} />
        <BiddingModal />
        <View style={styles.bottom}>
          {currentPlayerData?.playerData && (
            <CurrentPlayerHand
              playerData={currentPlayerData.playerData}
              isActive={gameUserPosition === gameCurrentPosition}
              onPlayCard={playCard}
            />
          )}
        </View>
      </View>
      <View style={styles.right}>
        {right?.playerData && <OpponentHand playerData={right.playerData} />}
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
