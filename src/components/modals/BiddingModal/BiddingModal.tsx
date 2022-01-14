import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, View } from "react-native";

import { SPACING } from "../../../resources/dimens";
import { useAppSelector } from "../../../store/hooks";

import { ChoosePartnerPage } from "./bidding_pages";
import { BiddingPage } from "./bidding_pages/BiddingPage";

export const BiddingModal = () => {
  const [biddingModalVisible, setBiddingModalVisible] = useState(true);
  const isBidding = false;

  // useEffect(() => {
  //   setBiddingModalVisible(isBidding);
  // }, [isBidding]);

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
    borderRadius: SPACING.spacing12,
    alignItems: "center",
    maxWidth: "68%",
  },
  contentContainer: {
    justifyContent: "center",
    padding: SPACING.spacing32,
  },
});
