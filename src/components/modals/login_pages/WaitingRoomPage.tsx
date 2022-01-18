import React, { useMemo } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { batch } from "react-redux";

import { FONT_SIZE, SPACING } from "../../../resources";
import { TextButton, RoomIdClipboard } from "../../molecules";
import { UserEntry, ThemedText, UserEntryContentLoader } from "../../elements";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
  initialiseGame,
  resumeGame,
  triggerGameStartedLoading,
  unsubscribeToChannel,
} from "../../../utils";
import { resetRoom, setGameStatus } from "../../../store/features/room";
import type { Player } from "../../../store/features/game";
import { resetGame } from "../../../store/features/game";

type WaitingRoomPageProps = {
  players: Player[];
};

export const WaitingRoomPage = ({ players }: WaitingRoomPageProps) => {
  const userId = useAppSelector((state) => state.auth.userId);
  const roomId = useAppSelector((state) => state.room.roomId);
  const username = useAppSelector((state) => state.room.username);
  const gameStatus = useAppSelector((state) => state.room.gameStatus);
  const gameExists = useAppSelector((state) => state.room.gameExists);
  const gameId = useAppSelector((state) => state.game.gameId);
  const roomReady = useMemo(
    () => (players.length === 4 ? true : false),
    [players]
  );

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
      if (gameExists && gameId) {
        await resumeGame(roomId, gameId);
      } else {
        await initialiseGame(userId, roomId, players);
      }
    } catch (err) {
      console.error(err);
      dispatch(setGameStatus("stopped"));
    }
  };

  const leaveRoom = () => {
    if (!roomId) {
      return;
    }
    try {
      unsubscribeToChannel(roomId);
    } catch (err) {
      console.error(err);
    }
    batch(() => {
      dispatch(resetRoom());
      dispatch(resetGame());
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.titleContainer}>
          <TouchableOpacity onPress={leaveRoom} style={styles.closeButton}>
            <Ionicons name="close-outline" size={32} color="black" />
          </TouchableOpacity>
          <ThemedText style={styles.titleText}>Waiting Room</ThemedText>
        </View>
        {roomId && (
          <RoomIdClipboard roomId={roomId} style={styles.idClipboard} />
        )}
      </View>
      <ThemedText
        style={styles.welcomeText}
      >{`Welcome ${username}!`}</ThemedText>
      <View style={styles.usersContainer}>
        {players.length > 0 ? (
          players.map((player) => {
            return (
              <UserEntry
                key={player.id}
                currentUsername={username || ""}
                player={player}
              />
            );
          })
        ) : (
          <UserEntryContentLoader />
        )}
      </View>
      {players.length !== 4 && (
        <ThemedText style={styles.errorText}>
          Need exactly 4 players to start the game!
        </ThemedText>
      )}
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
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    padding: SPACING.spacing32,
  },
  closeButton: {
    marginRight: SPACING.spacing8,
  },
  idClipboard: {
    marginLeft: SPACING.spacing16,
  },
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    fontFamily: "bold",
    fontSize: FONT_SIZE.title2,
    paddingVertical: SPACING.spacing8,
  },
  welcomeText: {
    fontFamily: "semiBold",
    fontSize: FONT_SIZE.title3,
    paddingVertical: SPACING.spacing8,
  },
  usersContainer: {
    marginVertical: SPACING.spacing16,
  },
  errorText: {
    color: "red",
    marginBottom: SPACING.spacing8,
  },
});
