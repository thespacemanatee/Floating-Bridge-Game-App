import React, { useEffect, useMemo, useState } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { ELEVATION, FONT_SIZE, SPACING } from "../../resources";
import { useAppSelector } from "../../store";
import type { Bid } from "../../store/features/game";
import { findPlayerData, getUnicodeCharacter } from "../../utils";
import { ThemedText } from "../elements";

type GameTurnAlertProps = {
  style?: StyleProp<ViewStyle>;
};

export const GameTurnAlert = ({ style }: GameTurnAlertProps) => {
  const progress = useSharedValue(0);
  const [visible, setVisible] = useState(false);
  const [previousBid, setPreviousBid] = useState<Bid>();
  const [alertText, setAlertText] = useState("");
  const [alertTimeout, setAlertTimeout] =
    useState<ReturnType<typeof setTimeout>>();
  const players = useAppSelector((state) => state.room.players);
  const gameStatus = useAppSelector((state) => state.room.gameStatus);
  const latestBid = useAppSelector((state) => state.game.latestBid);
  const partner = useAppSelector((state) => state.game.partner);
  const playedCards = useAppSelector((state) => state.game.playedCards);
  const bidPlayer = useMemo(() => {
    if (!latestBid) {
      return;
    }
    return findPlayerData(latestBid.userId, players);
  }, [latestBid, players]);
  const turnPlayer = useMemo(() => {
    const id = playedCards[playedCards.length - 1]?.playedBy;
    if (!id) {
      return;
    }
    return findPlayerData(id, players);
  }, [playedCards, players]);

  const showGameAlert = () => {
    if (alertTimeout) {
      clearTimeout(alertTimeout);
    }
    setVisible(true);
    const interval = setTimeout(() => {
      setVisible(false);
    }, 2500);
    setAlertTimeout(interval);
  };

  useEffect(() => {
    if (visible) {
      progress.value = withDelay(100, withSpring(1, { stiffness: 250 }));
    } else {
      progress.value = withTiming(0);
    }
  }, [progress, visible]);

  useEffect(() => {
    if (!bidPlayer || !latestBid) {
      return;
    }
    const text =
      previousBid?.userId === latestBid.userId
        ? "Passed"
        : `${bidPlayer.info.username} bid ${
            latestBid.level
          } of ${getUnicodeCharacter(latestBid.trump)}!`;
    setAlertText(text);
    showGameAlert();
    setPreviousBid(latestBid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bidPlayer, latestBid, players]);

  useEffect(() => {
    if (!partner) {
      return;
    }
    setAlertText(
      `Partner is the ${partner.value.toUpperCase()} of ${getUnicodeCharacter(
        partner.suit
      )}!`
    );
    showGameAlert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partner]);

  useEffect(() => {
    const playedCard = playedCards[playedCards.length - 1];
    if (!turnPlayer || !playedCard) {
      return;
    }
    setAlertText(
      `${
        turnPlayer.info.username
      } played ${playedCard.value.toUpperCase()} of ${getUnicodeCharacter(
        playedCard.suit
      )}!`
    );
    showGameAlert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playedCards, turnPlayer]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: progress.value,
      },
    ],
  }));

  if (gameStatus === "started") {
    return (
      <Animated.View style={[styles.container, animatedStyle, style]}>
        <ThemedText style={styles.alertText}>{alertText}</ThemedText>
      </Animated.View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: SPACING.spacing32,
    borderRadius: SPACING.spacing12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: ELEVATION.elevation16,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  alertText: {
    fontSize: FONT_SIZE.title2,
    fontFamily: "semiBold",
  },
});
