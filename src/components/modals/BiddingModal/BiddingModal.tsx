import React, { useEffect, useState } from "react";
import { Modal, Platform, StyleSheet, View } from "react-native";

import { SPACING } from "../../../resources/dimens";
import { useAppSelector } from "../../../store/hooks";

import { ChoosePartnerPage } from "./bidding_pages";
import { BiddingPage } from "./bidding_pages/BiddingPage";

export const BiddingModal = () => {
  const [biddingModalVisible, setBiddingModalVisible] = useState(true);
  const gameStatus = useAppSelector((state) => state.room.gameStatus);
  const isBidding = useAppSelector((state) => state.game.isBidding);
  const partner = useAppSelector((state) => state.game.partner);

  useEffect(() => {
    if (gameStatus !== "started" || (!isBidding && partner)) {
      setBiddingModalVisible(false);
    } else {
      setBiddingModalVisible(true);
    }
  }, [gameStatus, isBidding, partner]);

  return (
    <Modal
      animationType="fade"
      transparent
      visible={biddingModalVisible}
      onRequestClose={() => {
        setBiddingModalVisible(!biddingModalVisible);
      }}
    >
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
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxWidth: Platform.select({ web: "60%" }),
  },
  contentContainer: {
    justifyContent: "center",
    padding: SPACING.spacing32,
  },
});
