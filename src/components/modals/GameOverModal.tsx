import React, { useEffect, useMemo, useRef, useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import LottieView from "react-native-web-lottie";

import { ELEVATION, FONT_SIZE, SPACING } from "../../resources";
import { useAppSelector } from "../../store/hooks";
import { getWinners } from "../../utils";
import { ThemedText } from "../elements";
import { StartGameButton } from "../molecules/StartGameButton";
import { TitleCloseButton } from "../molecules/TitleCloseButton";

export const GameOverModal = () => {
  const [modalVisible, setModalVisible] = useState(true);
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
  const roundNo = useAppSelector((state) => state.game.roundNo);
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

  useEffect(() => {
    if (roundNo >= 13 && roomId) {
      setModalVisible(true);
    } else {
      setModalVisible(false);
    }
  }, [roomId, roundNo]);

  return (
    <Modal animationType="fade" transparent visible={modalVisible}>
      <View style={styles.container}>
        <View style={styles.modalView}>
          <View style={styles.contentContainer}>
            <TitleCloseButton title="Game Over!" roomId={roomId} />
            <LottieView
              ref={animationRef}
              loop
              autoPlay
              source={
                isWinner
                  ? require("../../../assets/lottie/confetti.json")
                  : require("../../../assets/lottie/lose.json")
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
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00000099",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: SPACING.spacing12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: ELEVATION.elevation6,
  },
  contentContainer: {
    justifyContent: "center",
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
