import React, { useEffect, useRef } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { LottieView } from "../..";
import { FONT_SIZE, SPACING } from "../../resources/dimens";
import { ThemedText } from "../elements";

type RoomIdGenerateButtonProps = {
  roomId: string;
  onPress: () => void;
};

export const RoomIdGenerateButton = ({
  roomId,
  onPress,
}: RoomIdGenerateButtonProps) => {
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    if (roomId) {
      animationRef.current?.reset();
      animationRef.current?.play();
    }
  }, [roomId]);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        { backgroundColor: pressed ? "#80d7ff" : "#47c5ff" },
        styles.generateButtonContainer,
      ]}
    >
      <View style={styles.generateButton}>
        <ThemedText
          style={{
            color: "white",
            fontFamily: "semiBold",
            fontSize: FONT_SIZE.tiny,
          }}
        >
          {roomId ? "Copied" : "Generate"}
        </ThemedText>
        {!!roomId && (
          <LottieView
            ref={animationRef}
            style={{
              width: 25,
              height: 25,
            }}
            source={require("../../../assets/lottie/tick.json")}
          />
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  generateButtonContainer: {
    marginLeft: SPACING.spacing8,
    padding: SPACING.spacing8,
    borderRadius: SPACING.spacing8,
  },
  generateButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
});
