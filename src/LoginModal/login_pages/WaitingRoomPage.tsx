import React, { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { Member } from "../../types";
import { FONT_SIZE, SPACING } from "../../resources/dimens";
import { TextButton } from "../../components/molecules/TextButton";
import { LobbyUserEntry } from "../../components/elements/LobbyUserEntry";
import { ThemedText } from "../../components/elements/ThemedText";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { resetGame } from "../../store/features/game/gameSlice";
import { unsubscribeToChannel } from "../../utils/PusherHelper";

type WaitingRoomPageProps = {
  users: Member[];
  onStartGame: () => void;
};

export const WaitingRoomPage = ({
  users,
  onStartGame,
}: WaitingRoomPageProps) => {
  const username = useAppSelector((state) => state.game.username);
  const roomId = useAppSelector((state) => state.game.roomId);

  const dispatch = useAppDispatch();

  const roomReady = useMemo(() => {
    return users.length === 4 ? true : false;
  }, [users]);

  const leaveRoom = () => {
    if (roomId) {
      unsubscribeToChannel(roomId);
    }
    dispatch(resetGame());
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={leaveRoom}>
        <Ionicons name="close-outline" size={32} color="black" />
      </TouchableOpacity>
      <ThemedText
        style={styles.titleText}
      >{`Waiting Room (ID: ${roomId})`}</ThemedText>
      <ThemedText
        style={styles.welcomeText}
      >{`Welcome ${username}!`}</ThemedText>
      <View style={styles.usersContainer}>
        {users.map((member) => {
          return (
            <LobbyUserEntry
              key={member.id}
              currentUsername={username || ""}
              member={member}
            />
          );
        })}
      </View>
      {users.length !== 4 && (
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
