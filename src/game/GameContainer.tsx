import React from "react";
import { StyleSheet } from "react-native";

import { leaveRoom } from "../utils";
import { BiddingModal } from "../components/modals";
import { GameBackground, CloseButton } from "../components/elements";
import { Alert } from "../components/elements/Alert";
import { useAppSelector } from "../store";
import { GameTurnAlert } from "../components/game/GameTurnAlert";

import { Game, SandboxGame } from ".";

export const GameContainer = () => {
  const gameStatus = useAppSelector((state) => state.room.gameStatus);

  const tryLeaveRoom = () => {
    Alert.alert("Warning!", "Are you sure you want to leave the game?", [
      {
        text: "Yes",
        onPress: leaveRoom,
        style: "destructive",
      },
      {
        text: "Cancel",
      },
    ]);
  };

  return (
    <GameBackground>
      <BiddingModal />
      <CloseButton onPress={tryLeaveRoom} />
      <GameTurnAlert style={styles.gameTurnAlert} />
      {gameStatus === "sandbox" ? <SandboxGame /> : <Game />}
    </GameBackground>
  );
};

const styles = StyleSheet.create({
  gameTurnAlert: {
    position: "absolute",
    top: 200,
    zIndex: 50,
  },
});
