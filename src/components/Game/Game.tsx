import React, { useCallback, useEffect, useMemo } from "react";
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { batch } from "react-redux";

import type { PlayCardPayload } from "../../store/features/game";
import { setGameUserPosition, resetGame } from "../../store/features/game";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { resetRoom } from "../../store/features/room/roomSlice";
import {
  unsubscribeToChannel,
  getHandPositions,
  isInvalidPlayCard,
  triggerNextTurnEvent,
} from "../../utils";
import { SPACING } from "../../resources/dimens";
import { BiddingModal } from "../modals/BiddingModal";
import type { Card } from "../../models";
import { GameOverModal } from "../modals/GameOverModal/GameOverModal";

import { Floor } from "./Floor";
import { CurrentPlayerHand } from "./CurrentPlayerHand";
import { WonSets } from "./WonSets";
import { TopOpponentGroup } from "./TopOpponentGroup";
import { GameHUD } from "./GameHUD";

import { HorizontalOpponentGroup } from ".";

export const Game = () => {
  const userId = useAppSelector((state) => state.auth.userId);
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

  const leaveRoom = useCallback(() => {
    try {
      unsubscribeToChannel(roomId);
    } catch (err) {
      console.error(err);
    }
    batch(() => {
      dispatch(resetRoom());
      dispatch(resetGame());
    });
  }, [dispatch, roomId]);

  useEffect(() => {
    if (userPosition) {
      dispatch(setGameUserPosition(userPosition));
    }
  }, [dispatch, userPosition]);

  const playCard = async (card: Card, callback: () => void) => {
    if (!latestBid || !currentPlayerData?.playerData) {
      alert("There was a problem with the game!");
      leaveRoom();
      return;
    }

    if (
      isInvalidPlayCard(
        card,
        isTrumpBroken,
        playedCards,
        latestBid,
        currentPlayerData.playerData.hand
      )
    ) {
      callback();
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

  return (
    <ImageBackground
      source={{ uri: "https://dkqpv4xfvkxsw.cloudfront.net/background.jpg" }}
      style={styles.container}
    >
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
          />
        )}
        <Floor playedCards={playedCards} style={StyleSheet.absoluteFill} />
        {right?.playerData && (
          <HorizontalOpponentGroup
            playerData={right.playerData}
            active={currentPosition === right.position}
            mirrored
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
    </ImageBackground>
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
    zIndex: 10,
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
});
