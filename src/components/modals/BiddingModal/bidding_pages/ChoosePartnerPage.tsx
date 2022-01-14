import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import type { CardSuit, CardValue } from "../../../../models";
import { DECK, SUITS } from "../../../../models";
import { FONT_SIZE, SPACING } from "../../../../resources/dimens";
import type { Partner, TrumpSuit } from "../../../../store/features/game";
import { useAppSelector } from "../../../../store/hooks";
import { triggerSetPartnerEvent } from "../../../../utils/GameHelper";
import { PlayingCard, SuitButton, ThemedText } from "../../../elements";
import { TextButton } from "../../../molecules";

export const ChoosePartnerPage = () => {
  const userId = useAppSelector((state) => state.room.userId);
  const gameId = useAppSelector((state) => state.game.gameId);
  const latestBid = useAppSelector((state) => state.game.latestBid);
  const hands = useAppSelector((state) => state.game.hands);
  const [selectedSuit, setSelectedSuit] = useState<TrumpSuit>("c");
  const [selectedPartner, setSelectedPartner] = useState<Partner>();
  const isBidWinner = useMemo(
    () => userId === latestBid?.userId,
    [latestBid?.userId, userId]
  );

  const selectSuit = (suit: TrumpSuit) => {
    setSelectedSuit(suit);
  };

  const selectPartner = ({
    suit,
    value,
  }: {
    suit: CardSuit;
    value: CardValue;
  }) => {
    hands.forEach((hand) => {
      const isPartner = hand.hand.some((card) => {
        return card.suit === suit && card.value === value;
      });
      if (isPartner) {
        setSelectedPartner({
          userId: hand.userId,
          suit,
          value,
        });
      }
    });
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
        <ThemedText style={styles.titleText}>Congratulations!</ThemedText>
        <ThemedText style={styles.subtitleText}>
          Please choose your partner!
        </ThemedText>
        <View style={styles.suitButtonsContainer}>
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
        <View style={styles.playingCardsContainer}>
          {Object.entries(DECK)
            .filter((card) => card[1].suit === selectedSuit)
            .map((card) => (
              <Pressable
                key={card[0]}
                onPress={() => selectPartner(card[1])}
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
            ))}
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
      <ThemedText style={styles.titleText}>Welcome Player</ThemedText>
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
  subtitleText: {
    fontFamily: "bold",
    fontSize: FONT_SIZE.title3,
    marginBottom: SPACING.spacing8,
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
  confirmButton: {
    alignSelf: "flex-end",
  },
});
