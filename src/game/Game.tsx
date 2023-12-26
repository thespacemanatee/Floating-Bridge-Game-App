import { useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";

import {
  Floor,
  GameHUD,
  HorizontalOpponentGroup,
  TopOpponentGroup,
} from "../components/game";
import { CurrentPlayerGroup } from "../components/game/CurrentPlayerGroup";
import type { Card } from "../models";
import { SPACING } from "../resources";
import { useAppDispatch, useAppSelector } from "../store";
import type { PlayCardPayload } from "../store/features/game";
import {
  setGamePlayedCards,
  setGameUserPosition,
} from "../store/features/game";
import {
  getHandPositions,
  isInvalidPlayCard,
  leaveRoom,
  triggerNextTurnEvent,
} from "../utils";

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
    [players, userId],
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (userPosition) {
      dispatch(setGameUserPosition(userPosition));
    }
  }, [dispatch, userPosition]);

  useEffect(() => {
    if (playedCards.length === 4) {
      setTimeout(() => {
        dispatch(setGamePlayedCards([]));
      }, 1000);
    }
  }, [dispatch, playedCards.length]);

  const playCard = async (card: Card, callback: () => void) => {
    if (!latestBid || !currentPlayerData?.playerData || !userId || !gameId) {
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
        currentPlayerData.playerData.hand,
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
      await triggerNextTurnEvent(gameId, payload);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
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
        <CurrentPlayerGroup
          playerData={currentPlayerData.playerData}
          active={userPosition === currentPosition}
          onPlayCard={playCard}
        />
      )}
    </>
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
});
