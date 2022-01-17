import React, { useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";

import type { PlayCardPayload } from "../../store/features/game";
import { setGameUserPosition } from "../../store/features/game";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  getHandPositions,
  isInvalidPlayCard,
  triggerNextTurnEvent,
  leaveRoom,
} from "../../utils";
import { SPACING } from "../../resources/dimens";
import { BiddingModal } from "../modals/BiddingModal";
import type { Card } from "../../models";
import { GameOverModal } from "../modals/GameOverModal/GameOverModal";
import { GameBackground } from "../elements/GameBackground";
import { CloseButton } from "../elements/CloseButton";

import { Floor } from "./Floor";
import { CurrentPlayerHand } from "./CurrentPlayerHand";
import { WonSets } from "./WonSets";
import { TopOpponentGroup } from "./TopOpponentGroup";
import { GameHUD } from "./GameHUD";

import { HorizontalOpponentGroup } from ".";

export const Game = () => {
  const userId = useAppSelector((state) => state.auth.userId);
  const gameId = useAppSelector((state) => state.game.gameId);
  const players = useAppSelector((state) => state.game.players);
  const currentPosition = useAppSelector((state) => state.game.currentPosition);
  const latestBid = useAppSelector((state) => state.game.latestBid);
  const isTrumpBroken = useAppSelector((state) => state.game.isTrumpBroken);
  const playedCards = useAppSelector((state) => state.game.playedCards);
  const { userPosition, top, left, right, currentPlayerData } = useMemo(
    () => (userId ? getHandPositions(userId, players) : {}),
    [players, userId]
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (userPosition) {
      dispatch(setGameUserPosition(userPosition));
    }
  }, [dispatch, userPosition]);

  const playCard = async (card: Card, callback: () => void) => {
    if (!latestBid || !currentPlayerData?.playerData || !userId) {
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
    <GameBackground>
      <BiddingModal />
      <GameOverModal />
      <CloseButton onPress={leaveRoom} />
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
    </GameBackground>
  );
};

const styles = StyleSheet.create({
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
