import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { batch } from "react-redux";

import { FONT_SIZE, SPACING } from "../../../../resources/dimens";
import { TextButton } from "../../../molecules/TextButton";
import { UserEntry } from "../../../elements/UserEntry";
import { ThemedText } from "../../../elements/ThemedText";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
  findExistingGameById,
  initialiseGame,
  resumeGame,
  triggerGameStartedLoading,
  unsubscribeToChannel,
} from "../../../../utils";
import { resetRoom } from "../../../../store/features/room/roomSlice";
import type { Player } from "../../../../store/features/game";
import { setGameStatus, resetGame } from "../../../../store/features/game";
import { RoomIdClipboard } from "../../../molecules/RoomIdClipboard";
import { UserEntryContentLoader } from "../../../elements/UserEntryContentLoader";

type WaitingRoomPageProps = {
  players: Player[];
};

export const WaitingRoomPage = ({ players }: WaitingRoomPageProps) => {
  const [gameExists, setGameExists] = useState(false);
  const roomId = useAppSelector((state) => state.room.roomId);
  const isConnected = useAppSelector((state) => state.room.isConnected);
  const userId = useAppSelector((state) => state.room.userId);
  const username = useAppSelector((state) => state.room.username);
  const gameStatus = useAppSelector((state) => state.game.status);
  const gameId = useAppSelector((state) => state.game.gameId);
  const roomReady = useMemo(
    () => (players.length === 4 ? true : false),
    [players]
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    try {
      if (isConnected && gameId) {
        (async () => {
          setTimeout(async () => {
            const res = await findExistingGameById(roomId, gameId);
            setGameExists(res.data ? true : false);
          }, 500);
        })();
      }
    } catch (err) {
      console.error(err);
    }
  }, [gameId, isConnected, roomId]);

  const onStartOrResumeGame = async () => {
    try {
      triggerGameStartedLoading();
      dispatch(setGameStatus("loading"));
      if (gameExists && gameId) {
        await resumeGame(roomId, gameId);
      } else {
        await initialiseGame(userId, roomId, players);
      }
    } catch (err) {
      dispatch(setGameStatus("stopped"));
    }
  };

  const leaveRoom = () => {
    unsubscribeToChannel(roomId);
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
        <RoomIdClipboard roomId={roomId} />
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
