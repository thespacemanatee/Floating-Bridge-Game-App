import React from "react";
import { Image, Linking, StyleSheet, View } from "react-native";

import { FONT_SIZE, SPACING } from "../../resources";
import { ThemedText } from "../elements";

export const Branding = () => {
  return (
    <View style={styles.brandingContainer}>
      <Image
        source={require("../../../assets/powered_by_do.svg")}
        style={styles.doIcon}
      />
      <View style={styles.divider} />
      <ThemedText style={styles.copyrightText}>
        © 2022 -{" "}
        <ThemedText onPress={() => Linking.openURL("https://cheekit.tech/")}>
          Chee Kit
        </ThemedText>
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  brandingContainer: {
    marginTop: SPACING.spacing16,
    justifyContent: "center",
    alignItems: "center",
  },
  doIcon: {
    height: 30,
    width: 144,
  },
  divider: {
    height: 1,
    width: "90%",
    backgroundColor: "lightgray",
    margin: SPACING.spacing16,
  },
  copyrightText: {
    fontFamily: "light",
    fontSize: FONT_SIZE.small,
    color: "gray",
  },
});
