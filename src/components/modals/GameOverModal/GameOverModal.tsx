import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, View } from "react-native";

import { FONT_SIZE, SPACING } from "../../../resources";
import { useAppSelector } from "../../../store/hooks";
import { getWinners } from "../../../utils";
import { ThemedText } from "../../elements";

export const GameOverModal = () => {
  const [modalVisible, setModalVisible] = useState(true);
  const roundNo = useAppSelector((state) => state.game.roundNo);
  const players = useAppSelector((state) => state.game.players);
  const latestBid = useAppSelector((state) => state.game.latestBid);
  const partner = useAppSelector((state) => state.game.partner);

  useEffect(() => {
    if (roundNo >= 13) {
      setModalVisible(true);
    } else {
      setModalVisible(false);
    }
  }, [roundNo]);

  return (
    <Modal animationType="fade" transparent visible={modalVisible}>
      <View style={styles.biddingModalContainer}>
        <View style={styles.modalView}>
          <View style={styles.contentContainer}>
            <ThemedText style={styles.titleText}>Game Over!</ThemedText>
            <ThemedText>Winners</ThemedText>
            {latestBid &&
              partner &&
              getWinners(
                latestBid?.level,
                players,
                latestBid?.userId,
                partner?.userId
              ).map((player) => (
                <ThemedText
                  key={player.id}
                >{`${player.info.username}`}</ThemedText>
              ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  biddingModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000099",
  },
  modalView: {
    backgroundColor: "white",
    alignItems: "center",
    margin: SPACING.spacing48,
    borderRadius: SPACING.spacing12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  contentContainer: {
    justifyContent: "center",
    padding: SPACING.spacing32,
  },
  titleText: {
    fontFamily: "bold",
    fontSize: FONT_SIZE.title2,
  },
});
