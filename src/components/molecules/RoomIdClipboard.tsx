import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Clipboard from "@react-native-clipboard/clipboard";

import { ThemedText } from "../elements";
import { SPACING } from "../../resources/dimens";

type RoomIdClipboardProps = {
  roomId: string;
};

export const RoomIdClipboard = ({ roomId }: RoomIdClipboardProps) => {
  const copyRoomIdToClipboard = () => {
    Clipboard.setString(roomId);
  };

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <ThemedText style={styles.roomIdText}>{`ID: ${roomId}`}</ThemedText>
      <TouchableOpacity onPress={copyRoomIdToClipboard}>
        <Ionicons name="clipboard-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  roomIdText: {
    fontFamily: "semiBold",
    marginRight: SPACING.spacing8,
  },
});
