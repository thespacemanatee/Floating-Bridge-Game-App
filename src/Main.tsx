import React from "react";
import { StyleSheet, View } from "react-native";

import LoginModal from "./components/LoginModal";
import { useEffect } from "react";
import Game from "./components/Game";
import { pusherRef } from "./utils/PusherHelper";

const Main = () => {
  useEffect(() => {
    // TODO: Remove hardcoded values
    const channel = pusherRef.current?.subscribe("private-game-channel");
    channel?.bind("game-event", (data: any) => {
      alert(JSON.stringify(data));
    });
  }, []);

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
