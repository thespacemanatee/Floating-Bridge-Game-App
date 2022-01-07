import React from "react";
import { StyleSheet, View } from "react-native";
import Pusher from "pusher-js/react-native";
import { HOST, AUTH_ENDPOINT, PUSHER_KEY, PUSHER_CLUSTER } from "@env";
import LoginModal from "./components/LoginModal";
import { useEffect } from "react";
import Game from "./components/Game";

const pusher = new Pusher(PUSHER_KEY, {
  authEndpoint: HOST + AUTH_ENDPOINT,
  cluster: PUSHER_CLUSTER,
});

const Main = () => {
  useEffect(() => {
    // TODO: Remove hardcoded values
    const channel = pusher.subscribe("private-game-channel");
    channel.bind("game-event", (data) => {
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
