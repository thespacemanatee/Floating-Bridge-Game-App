import React from "react";

import { leaveRoom } from "../utils";
import { BiddingModal } from "../components/modals";
import { GameBackground, CloseButton } from "../components/elements";
import { Alert } from "../components/elements/Alert";
import { useAppSelector } from "../store";

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
      {gameStatus === "sandbox" ? <SandboxGame /> : <Game />}
    </GameBackground>
  );
};
