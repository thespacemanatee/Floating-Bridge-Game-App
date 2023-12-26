import { useEffect, useState } from "react";
import { Modal, StyleSheet, View } from "react-native";

import { ELEVATION, SPACING } from "../../resources";
import { useAppSelector } from "../../store";

import { BiddingPage, ChoosePartnerPage } from "./bidding_pages";

export const BiddingModal = () => {
  const [biddingModalVisible, setBiddingModalVisible] = useState(true);
  const gameStatus = useAppSelector((state) => state.room.gameStatus);
  const isBidding = useAppSelector((state) => state.game.isBidding);
  const partner = useAppSelector((state) => state.game.partner);

  useEffect(() => {
    if (gameStatus === "started" && (isBidding || !partner)) {
      setBiddingModalVisible(true);
    } else {
      setBiddingModalVisible(false);
    }
  }, [gameStatus, isBidding, partner]);

  return (
    <Modal animationType="fade" transparent visible={biddingModalVisible}>
      <View style={styles.biddingModalContainer}>
        <View style={styles.modalView}>
          <View style={styles.contentContainer}>
            {isBidding ? <BiddingPage /> : <ChoosePartnerPage />}
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
  },
  modalView: {
    backgroundColor: "white",
    margin: SPACING.spacing48,
    borderRadius: SPACING.spacing12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: ELEVATION.elevation6,
  },
  contentContainer: {
    justifyContent: "center",
    padding: SPACING.spacing32,
  },
});
