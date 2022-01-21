import React from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Clipboard from "@react-native-clipboard/clipboard";

import { ThemedText } from "../elements";
import { SPACING } from "../../resources";

type RoomIdClipboardProps = {
  roomId: string | null;
  style?: StyleProp<ViewStyle>;
};

export const RoomIdClipboard = ({ roomId, style }: RoomIdClipboardProps) => {
  const copyRoomIdToClipboard = () => {
    if (!roomId) {
      return;
    }
    Clipboard.setString(roomId);
  };

  return (
    <View style={[styles.container, style]}>
      <ThemedText style={styles.roomIdText}>{`ID: ${roomId}`}</ThemedText>
      <TouchableOpacity onPress={copyRoomIdToClipboard}>
        <Ionicons name="clipboard-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  roomIdText: {
    fontFamily: "semiBold",
    marginRight: SPACING.spacing8,
  },
});
