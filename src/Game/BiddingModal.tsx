import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, View } from "react-native";

import { LevelButton } from "../components/elements/LevelButton";
import { SuitButton } from "../components/elements/SuitButton";
import { ThemedText } from "../components/elements/ThemedText";
import { TextButton } from "../components/molecules/TextButton";
import { FONT_SIZE, SPACING } from "../resources/dimens";
import type {
  Bid,
  BidLevel,
  TrumpSuit,
} from "../store/features/game/gameSlice";
import { useAppSelector } from "../store/hooks";
import { triggerNextBidEvent } from "../utils/GameHelper";

const LEVELS: BidLevel[] = [1, 2, 3, 4, 5, 6, 7];
const SUITS: TrumpSuit[] = ["c", "d", "h", "s", "n"];

export const BiddingModal = () => {
  const [biddingModalVisible, setBiddingModalVisible] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<BidLevel>();
  const [selectedSuit, setSelectedSuit] = useState<TrumpSuit>();
  const userId = useAppSelector((state) => state.room.userId);
  const gameId = useAppSelector((state) => state.game.gameId);
  const userPosition = useAppSelector((state) => state.game.userPosition);
  const currentPosition = useAppSelector((state) => state.game.currentPosition);
  const latestBid = useAppSelector((state) => state.game.latestBid);
  const isBidding = useAppSelector((state) => state.game.isBidding);

  useEffect(() => {
    setBiddingModalVisible(isBidding);
  }, [isBidding]);

  const selectLevel = (level: BidLevel) => {
    setSelectedLevel(level);
  };

  const selectSuit = (suit: TrumpSuit) => {
    setSelectedSuit(suit);
  };

  const confirmBid = async () => {
    if (selectedLevel && selectedSuit) {
      if (latestBid) {
        const { level, suit } = latestBid;
        if (
          selectedLevel < level ||
          (selectedLevel === level &&
            SUITS.indexOf(selectedSuit) <= SUITS.indexOf(suit))
        ) {
          alert("Please bid higher!");
          return;
        }
      }
      const bid: Bid = {
        userId,
        suit: selectedSuit,
        level: selectedLevel,
      };
      if (gameId) {
        try {
          await triggerNextBidEvent(gameId, bid);
        } catch (err) {
          console.error(err);
        }
      }
    } else {
      alert("Please select your bid!");
    }
  };

  const passBid = async () => {
    if (gameId) {
      try {
        await triggerNextBidEvent(gameId);
      } catch (err) {
        console.error(err);
      }
    }
  };

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
            <View style={styles.topContainer}>
              <View>
                <ThemedText style={styles.biddingTitleText}>
                  {`Welcome Player ${userPosition + 1}`}
                </ThemedText>
                <ThemedText style={styles.biddingPlayerText}>
                  {`Player ${currentPosition + 1} is bidding...`}
                </ThemedText>
              </View>
              <View>
                <ThemedText style={styles.bidText}>{`Level: ${
                  latestBid?.level || "N/A"
                }`}</ThemedText>
                <ThemedText style={styles.bidText}>{`Suit: ${
                  latestBid?.suit || "N/A"
                }`}</ThemedText>
              </View>
            </View>
            <View style={styles.bidButtonsContainer}>
              {LEVELS.map((level) => (
                <LevelButton
                  key={level}
                  level={level}
                  selectedLevel={selectedLevel}
                  onSelectLevel={selectLevel}
                  style={styles.bidButton}
                />
              ))}
            </View>
            <View style={styles.bidButtonsContainer}>
              {SUITS.map((suit) => (
                <SuitButton
                  key={suit}
                  suit={suit}
                  selectedSuit={selectedSuit}
                  onSelectSuit={selectSuit}
                  style={styles.bidButton}
                />
              ))}
            </View>
            <View style={styles.buttonsContainer}>
              <TextButton
                text="Confirm"
                onPress={confirmBid}
                disabled={
                  userPosition !== currentPosition ||
                  !selectedSuit ||
                  !selectedLevel
                }
                style={styles.button}
              />
              <TextButton
                text="Pass"
                onPress={passBid}
                disabled={userPosition !== currentPosition}
              />
            </View>
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
  },
  contentContainer: {
    justifyContent: "center",
    padding: SPACING.spacing32,
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  biddingTitleText: {
    fontFamily: "bold",
    fontSize: FONT_SIZE.title2,
    marginBottom: SPACING.spacing8,
  },
  biddingPlayerText: {
    fontFamily: "semiBold",
    fontSize: FONT_SIZE.title3,
    marginBottom: SPACING.spacing8,
  },
  bidText: {
    fontFamily: "semiBold",
    fontSize: FONT_SIZE.title3,
  },
  bidButtonsContainer: {
    flexDirection: "row",
  },
  bidButton: {
    margin: SPACING.spacing4,
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: SPACING.spacing8,
  },
  button: {
    marginRight: SPACING.spacing8,
  },
});
