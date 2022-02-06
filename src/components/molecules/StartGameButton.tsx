import React from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { ActivityIndicator } from "react-native";
import { batch } from "react-redux";

import { useAppDispatch, useAppSelector } from "../../store";
import {
  initialiseGame,
  resumeGame,
  triggerGameStartedLoading,
} from "../../utils";
import type { Player } from "../../store/features/game";
import { resetGame } from "../../store/features/game";
import { setGameStatus } from "../../store/features/room";

import { TextButton } from ".";

type StartGameButtonProps = {
  userId: string | null;
  roomId: string | null;
  gameStatus: string;
  gameExists: boolean;
  gameId: string | null;
  players: Player[];
  roomReady: boolean;
  style?: StyleProp<ViewStyle>;
};

export const StartGameButton = ({
  userId,
  roomId,
  gameStatus,
  gameExists,
  gameId,
  players,
  roomReady,
  style,
}: StartGameButtonProps) => {
  const roundNo = useAppSelector((state) => state.game.roundNo);

  const dispatch = useAppDispatch();

  const onStartOrResumeGame = async () => {
    if (!userId || !roomId) {
      console.error("Missing userId or roomId for some reason...");
      return;
    }
    try {
      triggerGameStartedLoading();
      batch(() => {
        dispatch(resetGame());
        dispatch(setGameStatus("loading"));
      });
      if (gameExists && gameId && roundNo < 13) {
        await resumeGame(roomId, gameId);
      } else {
        await initialiseGame(userId, roomId, players);
      }
    } catch (err) {
      console.error(err);
      dispatch(setGameStatus("stopped"));
    }
  };
  return (
    <TextButton
      text={
        // eslint-disable-next-line no-nested-ternary
        gameStatus === "loading"
          ? "Starting..."
          : gameExists
          ? "Resume!"
          : "Start!"
      }
      onPress={onStartOrResumeGame}
      disabled={!roomReady || gameStatus === "loading"}
      rightComponent={() =>
        gameStatus === "loading" && <ActivityIndicator color="white" />
      }
      style={style}
    />
  );
};
