import React from "react";
import type { ViewStyle, StyleProp } from "react-native";
import { StyleSheet, View, Image } from "react-native";

const CARD_WIDTH = 180;
const CARD_HEIGHT = 250;

type BackCardProps = {
  style: StyleProp<ViewStyle>;
};

export const BackCard = ({ style }: BackCardProps) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.card}>
        <Image
          source={require("../../../assets/images/cards/BACK.svg")}
          style={{
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  card: {},
});
