import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";

import { LoginModal } from "./components/modals/LoginModal";
import { Game } from "./components/Game";
import { setGameStatus } from "./store/features/game";
import { useAppDispatch } from "./store/hooks";

export const Main = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const stopGame = () => {
      dispatch(setGameStatus("stopped"));
    };
    window.addEventListener("beforeunload", stopGame);
    return () => {
      window.removeEventListener("beforeunload", stopGame);
    };
  }, [dispatch]);

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
