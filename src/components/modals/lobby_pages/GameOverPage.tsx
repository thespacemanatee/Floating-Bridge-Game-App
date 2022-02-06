import React, { useMemo, useRef } from "react";
import { StyleSheet, View } from "react-native";
import LottieView from "react-native-web-lottie";

import { TitleCloseButton } from "../../molecules/TitleCloseButton";
import { ThemedText } from "../../elements";
import { StartGameButton } from "../../molecules/StartGameButton";
import { useAppSelector } from "../../../store";
import { getWinners } from "../../../utils";
import { FONT_SIZE, SPACING } from "../../../resources";

export const GameOverPage = () => {
  const animationRef = useRef<LottieView>(null);
  const userId = useAppSelector((state) => state.auth.userId);
  const roomId = useAppSelector((state) => state.room.roomId);
  const players = useAppSelector((state) => state.room.players);
  const gameStatus = useAppSelector((state) => state.room.gameStatus);
  const gameExists = useAppSelector((state) => state.room.gameExists);
  const gameId = useAppSelector((state) => state.game.gameId);
  const roomReady = useMemo(
    () => (players.length === 4 ? true : false),
    [players]
  );
  const latestBid = useAppSelector((state) => state.game.latestBid);
  const partner = useAppSelector((state) => state.game.partner);
  const gamePlayers = useAppSelector((state) => state.game.players);
  const winners = useMemo(
    () =>
      latestBid &&
      partner &&
      getWinners(
        latestBid?.level,
        gamePlayers,
        latestBid?.userId,
        partner?.userId
      ),
    [gamePlayers, latestBid, partner]
  );
  const isWinner = useMemo(
    () => winners?.find((player) => player.id === userId),
    [userId, winners]
  );

  return (
    <View style={styles.container}>
      <TitleCloseButton title="Game Over!" roomId={roomId} />
      <LottieView
        ref={animationRef}
        loop
        autoPlay
        source={
          isWinner
            ? require("../../../../assets/lottie/confetti.json")
            : require("../../../../assets/lottie/lose.json")
        }
        style={styles.lottieView}
      />
      <View style={styles.winnerContainer}>
        <ThemedText style={styles.winnerText}>Winners</ThemedText>
        {winners?.map((player) => (
          <ThemedText
            key={player.id}
            style={[{ color: player.info.color }, styles.winnerNameText]}
          >{`${player.info.username} ${
            player.id === userId ? " (You)" : ""
          }`}</ThemedText>
        ))}
      </View>
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
  lottieView: {
    width: 200,
    height: 200,
    margin: SPACING.spacing32,
  },
  winnerContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.spacing16,
  },
  winnerText: {
    fontFamily: "semiBold",
    fontSize: FONT_SIZE.title2,
  },
  winnerNameText: {
    fontFamily: "semiBold",
    fontSize: FONT_SIZE.title3,
  },
});
