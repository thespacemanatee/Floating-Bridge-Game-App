import React, { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";

import type { Card, CardSuit, CardValue } from "../../../../models";
import { DECK, SUITS } from "../../../../models";
import { FONT_SIZE, SPACING } from "../../../../resources/dimens";
import type { Trump } from "../../../../store/features/game";
import { useAppSelector } from "../../../../store/hooks";
import { triggerSetPartnerEvent } from "../../../../utils/GameHelper";
import { PlayingCard, SuitButton, ThemedText } from "../../../elements";
import { TextButton } from "../../../molecules";

type PartnerPayload = {
  suit: CardSuit;
  value: CardValue;
};

export const ChoosePartnerPage = () => {
  const userId = useAppSelector((state) => state.room.userId);
  const players = useAppSelector((state) => state.room.players);
  const gameId = useAppSelector((state) => state.game.gameId);
  const latestBid = useAppSelector((state) => state.game.latestBid);
  const currentHand = useAppSelector((state) =>
    state.game.players.find((hand) => hand.id === userId)
  );
  const [selectedSuit, setSelectedTrump] = useState<Trump>("c");
  const [selectedPartner, setSelectedPartner] = useState<PartnerPayload>();
  const isBidWinner = useMemo(
    () => userId === latestBid?.userId,
    [latestBid?.userId, userId]
  );
  const bidWinner = useMemo(
    () => players.find((player) => player.id === latestBid?.userId),
    [latestBid?.userId, players]
  );

  const selectTrump = (trump: Trump) => {
    setSelectedTrump(trump);
  };

  const selectPartner = ({ suit, value }: PartnerPayload) => {
    setSelectedPartner({ suit, value });
  };

  const confirmPartner = async () => {
    try {
      if (gameId && selectedPartner) {
        await triggerSetPartnerEvent(gameId, selectedPartner);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isBidWinner) {
    return (
      <View style={styles.container}>
        <ThemedText style={styles.titleText}>
          Congratulations{" "}
          <ThemedText
            style={[{ color: bidWinner?.info.color }, styles.titleText]}
          >
            {bidWinner?.info.username}
          </ThemedText>
          !
        </ThemedText>
        <ThemedText style={styles.winnerNameText}>
          Please choose your partner!
        </ThemedText>
        <View style={styles.suitButtonsContainer}>
          {SUITS.map((suit) => (
            <SuitButton
              key={suit}
              suit={suit}
              selectedSuit={selectedSuit}
              onSelectSuit={selectTrump}
              style={styles.bidButton}
            />
          ))}
        </View>
        <View style={styles.playingCardsContainer}>
          {Object.entries(DECK)
            .filter((card) => {
              const thisCard = card[1] as Card;
              return (
                thisCard.suit === selectedSuit &&
                !currentHand?.hand.some(
                  (otherCard) =>
                    otherCard.suit === thisCard.suit &&
                    otherCard.value === thisCard.value
                )
              );
            })
            .map((card) => {
              const partner = card[1] as Card;
              return (
                <Pressable
                  key={card[0]}
                  onPress={() => selectPartner(partner)}
                  style={({ pressed }) => [
                    {
                      backgroundColor:
                        // eslint-disable-next-line no-nested-ternary
                        selectedPartner?.value === card[1].value
                          ? "#21b9ff"
                          : pressed
                          ? "#47c5ff"
                          : "white",
                    },
                    styles.playingCardContainer,
                  ]}
                >
                  <PlayingCard
                    image={card[1].imageUri}
                    scaleSize={0.75}
                    style={styles.playingCard}
                  />
                </Pressable>
              );
            })}
        </View>
        <TextButton
          text="Confirm"
          onPress={confirmPartner}
          disabled={!selectedPartner}
          style={styles.confirmButton}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ThemedText style={styles.titleText}>Please wait...</ThemedText>
      <View style={styles.loadingContainer}>
        <ActivityIndicator style={styles.indicator} />
        <ThemedText style={styles.text}>
          <ThemedText
            style={[{ color: bidWinner?.info.color }, styles.winnerNameText]}
          >
            {`${bidWinner?.info.username} `}
          </ThemedText>
          is choosing a partner...
        </ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleText: {
    fontFamily: "bold",
    fontSize: FONT_SIZE.title2,
    marginBottom: SPACING.spacing8,
  },
  winnerNameText: {
    fontFamily: "bold",
    fontSize: FONT_SIZE.title3,
    marginBottom: SPACING.spacing8,
  },
  text: {
    fontSize: FONT_SIZE.large,
  },
  suitButtonsContainer: {
    flexDirection: "row",
  },
  bidButton: {
    margin: SPACING.spacing4,
  },
  playingCardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: SPACING.spacing8,
    justifyContent: "center",
  },
  playingCardContainer: {
    margin: SPACING.spacing4,
    padding: SPACING.spacing8,
    borderRadius: SPACING.spacing8,
  },
  playingCard: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingContainer: {
    flexDirection: "row",
  },
  indicator: {
    marginRight: SPACING.spacing8,
  },
  confirmButton: {
    alignSelf: "flex-end",
  },
});
