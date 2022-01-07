import React from "react";
import { StyleSheet, View } from "react-native";

import LoginModal from "./components/LoginModal";
import Game from "./components/Game";

const Main = () => {
  return (
    <View style={styles.container}>
      <LoginModal />
      <Game />
    </View>
  );
};

export default Main;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
