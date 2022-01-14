import React from "react";
import { StyleSheet, View } from "react-native";

import { LoginModal } from "./components/modals/LoginModal/LoginModal";
import { Game } from "./Game/Game";

export const Main = () => {
  return (
    <View style={styles.container}>
      <LoginModal />
      <Game />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
