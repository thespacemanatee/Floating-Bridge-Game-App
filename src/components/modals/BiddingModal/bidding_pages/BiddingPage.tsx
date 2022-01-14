import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { BID_LEVELS, TRUMP_SUITS } from "../../../../models";
import { FONT_SIZE, SPACING } from "../../../../resources/dimens";
import type { Bid, BidLevel, TrumpSuit } from "../../../../store/features/game";
import { useAppSelector } from "../../../../store/hooks";
import { getUnicodeCharacter } from "../../../../utils";
import { triggerNextBidEvent } from "../../../../utils/GameHelper";
import { LevelButton, SuitButton, ThemedText } from "../../../elements";
import { TextButton } from "../../../molecules";

export const BiddingPage = () => {
  const userPosition = useAppSelector((state) => state.game.userPosition);
  const currentPosition = useAppSelector((state) => state.game.currentPosition);
  const [selectedLevel, setSelectedLevel] = useState<BidLevel>();
  const [selectedSuit, setSelectedSuit] = useState<TrumpSuit>();
  const userId = useAppSelector((state) => state.room.userId);
  const gameId = useAppSelector((state) => state.game.gameId);
  const latestBid = useAppSelector((state) => state.game.latestBid);

  useEffect(() => {
    if (latestBid) {
      setSelectedLevel(undefined);
      setSelectedSuit(undefined);
    }
  }, [latestBid]);

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
            TRUMP_SUITS.indexOf(selectedSuit) <= TRUMP_SUITS.indexOf(suit))
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
      if (!latestBid) {
        alert("The starting player has to bid!");
      }
      try {
        await triggerNextBidEvent(gameId);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View>
          <ThemedText style={styles.titleText}>
            {`Welcome Player ${userPosition + 1}`}
          </ThemedText>
          <ThemedText style={styles.playerText}>
            {userPosition === currentPosition
              ? "Your turn to bid!"
              : `Player ${currentPosition + 1} is bidding...`}
          </ThemedText>
        </View>
        <View>
          <ThemedText style={styles.bidText}>
            {latestBid
              ? `Trump: ${latestBid?.level}${getUnicodeCharacter(
                  latestBid?.suit
                )}`
              : "Trump: N/A"}
          </ThemedText>
        </View>
      </View>
      <View style={styles.bidButtonsContainer}>
        {BID_LEVELS.map((level) => (
          <LevelButton
            key={level}
            level={level}
            selectedLevel={selectedLevel}
            onSelectLevel={selectLevel}
            disabled={level < (latestBid?.level || 0)}
            style={styles.bidButton}
          />
        ))}
      </View>
      <View style={styles.bidButtonsContainer}>
        {TRUMP_SUITS.map((suit) => (
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
            userPosition !== currentPosition || !selectedSuit || !selectedLevel
          }
          style={styles.button}
        />
        <TextButton
          text="Pass"
          onPress={passBid}
          disabled={userPosition !== currentPosition || !latestBid}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleText: {
    fontFamily: "bold",
    fontSize: FONT_SIZE.title2,
    marginBottom: SPACING.spacing8,
  },
  playerText: {
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
