import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import { nanoid } from "nanoid/non-secure";

import { SPACING } from "../../../resources/dimens";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setUserId } from "../../../store/features/auth";

import { LobbyPage, WaitingRoomPage } from "./login_pages";

export const LoginModal = () => {
  const [modalVisible, setModalVisible] = useState(true);
  const userId = useAppSelector((state) => state.auth.userId);
  const isConnected = useAppSelector((state) => state.room.isConnected);
  const username = useAppSelector((state) => state.room.username);
  const roomId = useAppSelector((state) => state.room.roomId);
  const players = useAppSelector((state) => state.room.players);
  const gameStatus = useAppSelector((state) => state.room.gameStatus);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!userId) {
      dispatch(setUserId(nanoid()));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    switch (gameStatus) {
      case "started": {
        setModalVisible(false);
        break;
      }
      case "stopped": {
        setModalVisible(true);
        break;
      }
    }
  }, [gameStatus]);

  return (
    <Modal animationType="fade" transparent visible={modalVisible}>
      <View style={styles.container}>
        <View style={styles.modalView}>
          {isConnected && userId && username && roomId ? (
            <WaitingRoomPage players={players} />
          ) : (
            <LobbyPage />
          )}
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
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: "50%",
    minWidth: 750,
  },
});
