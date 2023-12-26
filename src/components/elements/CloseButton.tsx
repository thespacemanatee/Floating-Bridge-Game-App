import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";

import { ELEVATION, SPACING } from "../../resources";

type CloseButtonProps = {
  onPress: () => void;
};

export const CloseButton = ({ onPress }: CloseButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.closeButton}>
      <Ionicons name="close-outline" size={32} color="black" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    position: "absolute",
    height: SPACING.spacing48,
    width: SPACING.spacing48,
    borderRadius: SPACING.spacing24,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    margin: SPACING.spacing32,
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: ELEVATION.elevation24,
  },
});
