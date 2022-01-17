import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { BID_LEVELS, TRUMP_SUITS } from "../../../../models";
import { FONT_SIZE, SPACING } from "../../../../resources/dimens";
import type { Bid, BidLevel, Trump } from "../../../../store/features/game";
import { useAppSelector } from "../../../../store/hooks";
import { leaveRoom, triggerNextBidEvent } from "../../../../utils";
import { LevelButton, SuitButton, ThemedText } from "../../../elements";
import { TextButton } from "../../../molecules";

export const BiddingPage = () => {
  const players = useAppSelector((state) => state.game.players);
  const userPosition = useAppSelector((state) => state.game.userPosition);
  const currentPosition = useAppSelector((state) => state.game.currentPosition);
  const [selectedLevel, setSelectedLevel] = useState<BidLevel>();
  const [selectedTrump, setSelectedSuit] = useState<Trump>();
  const userId = useAppSelector((state) => state.auth.userId);
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

  const selectSuit = (trump: Trump) => {
    setSelectedSuit(trump);
  };

  const confirmBid = async () => {
    if (!gameId || !userId) {
      alert("There was a problem with the game!");
      leaveRoom();
      return;
    }
    if (selectedLevel && selectedTrump) {
      if (latestBid) {
        const { level, trump } = latestBid;
        if (
          selectedLevel < level ||
          (selectedLevel === level &&
            TRUMP_SUITS.indexOf(selectedTrump) <= TRUMP_SUITS.indexOf(trump))
        ) {
          alert("Please bid higher!");
          return;
        }
      }
      const bid: Bid = {
        userId,
        trump: selectedTrump,
        level: selectedLevel,
      };
      try {
        await triggerNextBidEvent(gameId, bid);
      } catch (err) {
        console.error(err);
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
            Welcome{" "}
            <ThemedText
              style={[
                { color: players[userPosition]?.info.color },
                styles.titleText,
              ]}
            >{`${players[userPosition]?.info.username}`}</ThemedText>
            !
          </ThemedText>
          <ThemedText style={styles.playerText}>
            {userPosition === currentPosition ? (
              "Your turn to bid!"
            ) : (
              <ThemedText
                style={[
                  { color: players[currentPosition]?.info.color },
                  styles.playerText,
                ]}
              >{`${players[currentPosition]?.info.username} is bidding...`}</ThemedText>
            )}
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
        {TRUMP_SUITS.map((trump) => (
          <SuitButton
            key={trump}
            suit={trump}
            selectedSuit={selectedTrump}
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
            userPosition !== currentPosition || !selectedTrump || !selectedLevel
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
