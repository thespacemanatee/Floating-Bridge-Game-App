import { Ionicons } from "@expo/vector-icons";
import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { FONT_SIZE, SPACING } from "../../resources";
import { useAppDispatch } from "../../store";
import { resetGame } from "../../store/features/game";
import { resetRoom } from "../../store/features/room";
import { unsubscribeToChannel } from "../../utils";
import { ThemedText } from "../elements";

type TitleCloseButtonProps = {
  title: string;
  roomId: string | null;
  style?: StyleProp<ViewStyle>;
};

export const TitleCloseButton = ({
  title,
  roomId,
  style,
}: TitleCloseButtonProps) => {
  const dispatch = useAppDispatch();

  const leaveRoom = () => {
    try {
      if (roomId) {
        unsubscribeToChannel(roomId);
      }
    } catch (err) {
      console.error(err);
    }
    dispatch(resetRoom());
    dispatch(resetGame());
  };

  return (
    <View style={[styles.titleContainer, style]}>
      <TouchableOpacity onPress={leaveRoom} style={styles.closeButton}>
        <Ionicons name="close-outline" size={32} color="black" />
      </TouchableOpacity>
      <ThemedText style={styles.titleText}>{title}</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  closeButton: {
    marginRight: SPACING.spacing8,
  },
  titleText: {
    fontFamily: "bold",
    fontSize: FONT_SIZE.title2,
    paddingVertical: SPACING.spacing8,
  },
});
