import React from "react";
import { StyleSheet, View } from "react-native";

import { LobbyModal } from "./components/modals/LobbyModal";

import { GameContainer } from ".";

export const Main = () => {
  return (
    <View style={styles.container}>
      <LobbyModal />
      <GameContainer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
