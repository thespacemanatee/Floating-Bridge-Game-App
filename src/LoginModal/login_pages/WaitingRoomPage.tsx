import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";

import { mockUsers } from "../../mock/mockData";
import { FONT_SIZE, SPACING } from "../../resources/dimens";
import { Member } from "../../types/types";
import TextButton from "../../components/molecules/TextButton";
import LobbyUserEntry from "../../components/elements/LobbyUserEntry";
import ThemedText from "../../components/elements/ThemedText";

type WaitingRoomPageProps = {
  currentUsername: string;
  gameId: string;
  users: Member[];
  onStartGame: () => void;
};

const WaitingRoomPage = ({
  currentUsername,
  gameId,
  users,
  onStartGame,
}: WaitingRoomPageProps) => {
  const roomReady = useMemo(() => {
    return users.length === 4 ? true : false;
  }, [users]);

  return (
    <View style={styles.container}>
      <ThemedText
        style={styles.titleText}
      >{`Waiting Room (ID: ${gameId})`}</ThemedText>
      <ThemedText
        style={styles.welcomeText}
      >{`Welcome ${currentUsername}!`}</ThemedText>
      <View style={styles.usersContainer}>
        {users.map((member) => {
          return (
            <LobbyUserEntry
              key={member.id}
              currentUsername={currentUsername}
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

export default WaitingRoomPage;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    padding: SPACING.spacing_32,
  },
  titleText: {
    fontFamily: "bold",
    fontSize: FONT_SIZE.title2,
    paddingVertical: SPACING.spacing_8,
  },
  welcomeText: {
    fontFamily: "semiBold",
    fontSize: FONT_SIZE.title3,
    paddingVertical: SPACING.spacing_8,
  },
  usersContainer: {
    marginVertical: SPACING.spacing_16,
  },
  errorText: {
    color: "red",
    marginBottom: SPACING.spacing_8,
  },
});
