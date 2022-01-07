import React from "react";
import { StyleSheet, View } from "react-native";

import { FONT_SIZE, SPACING } from "../../resources/dimens";
import { Member } from "../LoginModal";
import ThemedText from "./ThemedText";

type LobbyUserEntryProps = {
  currentUsername: string;
  member: Member;
};

const LobbyUserEntry = ({ currentUsername, member }: LobbyUserEntryProps) => {
  const { username, color } = member.info;
  return (
    <View style={styles.userContainer}>
      <View style={[{ backgroundColor: color }, styles.orbContainer]}>
        <ThemedText selectable={false} style={styles.orbText}>
          {username[0]}
        </ThemedText>
      </View>
      <ThemedText style={[{ color }, styles.usernameText]}>
        {`${username}${username === currentUsername ? " (You)" : ""}`}
      </ThemedText>
    </View>
  );
};

export default LobbyUserEntry;

const styles = StyleSheet.create({
  userContainer: {
    flexDirection: "row",
    paddingVertical: SPACING.spacing_8,
    alignItems: "center",
  },
  orbContainer: {
    height: SPACING.spacing_48,
    width: SPACING.spacing_48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: SPACING.spacing_24,
    marginRight: SPACING.spacing_24,
  },
  orbText: {
    color: "white",
    fontFamily: "semiBold",
    fontSize: FONT_SIZE.title3,
  },
  usernameText: {
    fontFamily: "medium",
    fontSize: FONT_SIZE.medium,
  },
});
