import React, { useEffect, useMemo } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
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
import { ThemedText } from "../components/elements";

import { Floor } from "./Floor";
import { CurrentPlayerHand } from "./CurrentPlayerHand";
import { OpponentHand } from "./OpponentHand";
import { WonSets } from "./WonSets";

import { OpponentGroup } from ".";

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
      <BiddingModal />
      <TouchableOpacity onPress={leaveRoom} style={styles.closeButton}>
        <Ionicons name="close-outline" size={32} color="black" />
      </TouchableOpacity>
      {top?.playerData && (
        <View style={styles.topContainer}>
          <View style={styles.topHand}>
            <WonSets sets={top.playerData.sets} />
            <OpponentHand hand={top.playerData.hand} />
          </View>
          <View style={styles.topPlayer}>
            <ThemedText>{top.playerData.info.username}</ThemedText>
          </View>
        </View>
      )}
      <View style={styles.middle}>
        {left?.playerData && <OpponentGroup playerData={left.playerData} />}
        <Floor playedCards={playedCards} style={StyleSheet.absoluteFill} />
        {right?.playerData && (
          <OpponentGroup playerData={right.playerData} mirrored />
        )}
      </View>
      {currentPlayerData?.playerData && (
        <View style={styles.bottom}>
          <WonSets sets={currentPlayerData.playerData.sets} current />
          <CurrentPlayerHand
            hand={currentPlayerData.playerData.hand}
            isActive={gameUserPosition === gameCurrentPosition}
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
  topContainer: {
    flex: 1,
    alignItems: "center",
  },
  topHand: {
    flex: 1,
    alignItems: "center",
  },
  topPlayer: {
    // flex: 1,
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
