import { useMemo } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet, View } from "react-native";

import { ELEVATION, FONT_SIZE, SPACING } from "../../resources";
import { useAppSelector } from "../../store";
import { getColorFromUnicodeCharacter, getUnicodeCharacter } from "../../utils";
import { ThemedText } from "../elements";

type GameHUDProps = {
  style?: StyleProp<ViewStyle>;
};

export const GameHUD = ({ style }: GameHUDProps) => {
  const roundNo = useAppSelector((state) => state.game.roundNo);
  const players = useAppSelector((state) => state.game.players);
  const latestBid = useAppSelector((state) => state.game.latestBid);
  const partner = useAppSelector((state) => state.game.partner);
  const bidder = useMemo(
    () => players.find((player) => player.id === latestBid?.userId),
    [latestBid?.userId, players],
  );

  return (
    <View style={[styles.container, style]}>
      <View style={styles.entryContainer}>
        <ThemedText style={styles.labelText}>Round:</ThemedText>
        <ThemedText style={styles.valueText}>
          {Math.min(roundNo + 1, 13)}
        </ThemedText>
      </View>
      <View style={styles.entryContainer}>
        <ThemedText style={styles.labelText}>Trump:</ThemedText>
        {latestBid ? (
          <ThemedText
            style={[
              { color: getColorFromUnicodeCharacter(latestBid?.trump) },
              styles.valueText,
            ]}
          >{`${latestBid?.level}${getUnicodeCharacter(
            latestBid?.trump,
          )}`}</ThemedText>
        ) : (
          <ThemedText style={styles.valueText}>N/A</ThemedText>
        )}
      </View>
      <View style={styles.entryContainer}>
        <ThemedText style={styles.labelText}>Partner:</ThemedText>
        {partner ? (
          <ThemedText
            style={[
              { color: getColorFromUnicodeCharacter(partner.suit) },
              styles.valueText,
            ]}
          >{`${partner.value.toUpperCase()}${getUnicodeCharacter(
            partner.suit,
          )}`}</ThemedText>
        ) : (
          <ThemedText style={styles.valueText}>N/A</ThemedText>
        )}
      </View>
      <View style={styles.entryContainer}>
        <ThemedText style={styles.labelText}>Bidder:</ThemedText>
        {bidder ? (
          <ThemedText
            style={[{ color: bidder.info.color }, styles.valueText]}
          >{`${bidder.info.username}`}</ThemedText>
        ) : (
          <ThemedText style={styles.valueText}>N/A</ThemedText>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: SPACING.spacing16,
    borderRadius: SPACING.spacing12,
    width: 225,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: ELEVATION.elevation16,
  },
  entryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  labelText: {
    fontSize: FONT_SIZE.large,
    fontFamily: "semiBold",
  },
  valueText: {
    fontSize: FONT_SIZE.title2,
    fontFamily: "bold",
  },
});
