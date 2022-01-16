import React, { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { FONT_SIZE, SPACING } from "../../../../resources/dimens";
import { TextButton } from "../../../molecules/TextButton";
import { UserEntry } from "../../../elements/UserEntry";
import { ThemedText } from "../../../elements/ThemedText";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { unsubscribeToChannel } from "../../../../utils";
import { resetRoom } from "../../../../store/features/room/roomSlice";
import type { Player } from "../../../../store/features/game";
import { RoomIdClipboard } from "../../../molecules/RoomIdClipboard";

type WaitingRoomPageProps = {
  players: Player[];
  onStartGame: () => void;
};

export const WaitingRoomPage = ({
  players,
  onStartGame,
}: WaitingRoomPageProps) => {
  const username = useAppSelector((state) => state.room.username);
  const roomId = useAppSelector((state) => state.room.roomId);

  const dispatch = useAppDispatch();

  const roomReady = useMemo(
    () => (players.length === 4 ? true : false),
    [players]
  );

  const leaveRoom = () => {
    unsubscribeToChannel(roomId);
    dispatch(resetRoom());
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
        {players.map((player) => {
          return (
            <UserEntry
              key={player.id}
              currentUsername={username || ""}
              player={player}
            />
          );
        })}
      </View>
      {players.length !== 4 && (
        <ThemedText style={styles.errorText}>
          Need exactly 4 players to start the game!
        </ThemedText>
      )}
      <TextButton text="Start!" onPress={onStartGame} disabled={!roomReady} />
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
