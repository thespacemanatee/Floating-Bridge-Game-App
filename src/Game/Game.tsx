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
import { GameOverModal } from "../components/modals/GameOverModal/GameOverModal";

import { Floor } from "./Floor";
import { CurrentPlayerHand } from "./CurrentPlayerHand";
import { WonSets } from "./WonSets";
import { TopOpponentGroup } from "./TopOpponentGroup";
import { GameHUD } from "./GameHUD";

import { HorizontalOpponentGroup } from ".";

const HORIZONTAL_OFFSET = 40;

export const Game = () => {
  const userId = useAppSelector((state) => state.room.userId);
  const roomId = useAppSelector((state) => state.room.roomId);
  const gameId = useAppSelector((state) => state.game.gameId);
  const players = useAppSelector((state) => state.game.players);
  const currentPosition = useAppSelector((state) => state.game.currentPosition);
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
      <BiddingModal />
      <GameOverModal />
      <TouchableOpacity onPress={leaveRoom} style={styles.closeButton}>
        <Ionicons name="close-outline" size={32} color="black" />
      </TouchableOpacity>
      {gameId && <GameHUD style={styles.gameHud} />}
      {top?.playerData && (
        <TopOpponentGroup
          playerData={top.playerData}
          active={currentPosition === top.position}
        />
      )}
      <View style={styles.middle}>
        {left?.playerData && (
          <HorizontalOpponentGroup
            active={currentPosition === left.position}
            playerData={left.playerData}
            style={styles.leftGroup}
          />
        )}
        <Floor playedCards={playedCards} style={StyleSheet.absoluteFill} />
        {right?.playerData && (
          <HorizontalOpponentGroup
            playerData={right.playerData}
            active={currentPosition === right.position}
            mirrored
            style={styles.rightGroup}
          />
        )}
      </View>
      {currentPlayerData?.playerData && (
        <View style={styles.bottom}>
          <WonSets sets={currentPlayerData.playerData.sets} current />
          <CurrentPlayerHand
            hand={currentPlayerData.playerData.hand}
            isActive={userPosition === currentPosition}
            onPlayCard={playCard}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    margin: SPACING.spacing32,
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
  gameHud: {
    position: "absolute",
    right: 0,
    margin: SPACING.spacing32,
  },
  middle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bottom: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  leftGroup: {
    transform: [
      {
        translateX: -HORIZONTAL_OFFSET,
      },
    ],
  },
  rightGroup: {
    transform: [
      {
        translateX: HORIZONTAL_OFFSET,
      },
    ],
  },
});
