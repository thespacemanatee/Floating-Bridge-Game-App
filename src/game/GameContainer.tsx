import { StyleSheet } from "react-native";

import { CloseButton, GameBackground } from "../components/elements";
import { Alert } from "../components/elements/Alert";
import { GameTurnAlert } from "../components/game/GameTurnAlert";
import { BiddingModal } from "../components/modals";
import { useAppSelector } from "../store";
import { leaveRoom } from "../utils";

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
