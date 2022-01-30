import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";

import { FONT_SIZE, SPACING } from "../../../resources";
import { RoomIdClipboard } from "../../molecules";
import { UserEntry, ThemedText, UserEntryContentLoader } from "../../elements";
import { useAppSelector } from "../../../store";
import { StartGameButton } from "../../molecules/StartGameButton";
import { TitleCloseButton } from "../../molecules/TitleCloseButton";

export const WaitingRoomPage = () => {
  const userId = useAppSelector((state) => state.auth.userId);
  const roomId = useAppSelector((state) => state.room.roomId);
  const username = useAppSelector((state) => state.room.username);
  const players = useAppSelector((state) => state.room.players);
  const gameStatus = useAppSelector((state) => state.room.gameStatus);
  const gameExists = useAppSelector((state) => state.room.gameExists);
  const gameId = useAppSelector((state) => state.game.gameId);
  const roomReady = useMemo(() => players.length === 4, [players]);

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <TitleCloseButton title="Waiting Room" roomId={roomId} />
        <RoomIdClipboard roomId={roomId} style={styles.idClipboard} />
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
      <StartGameButton
        userId={userId}
        roomId={roomId}
        gameStatus={gameStatus}
        gameExists={gameExists}
        gameId={gameId}
        players={players}
        roomReady={roomReady}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.spacing32,
  },
  idClipboard: {
    marginLeft: SPACING.spacing16,
  },
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
