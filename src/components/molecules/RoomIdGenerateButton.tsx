import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { LottieView } from "../..";
import { FONT_SIZE, SPACING } from "../../resources/dimens";
import { ThemedText } from "../elements";

type RoomIdGenerateButtonProps = {
  onPress: () => void;
};

export const RoomIdGenerateButton = ({
  onPress,
}: RoomIdGenerateButtonProps) => {
  const animationRef = useRef<LottieView>(null);
  const [generated, setGenerated] = useState(false);

  const onGenerate = () => {
    setGenerated(true);
    onPress();
  };

  useEffect(() => {
    if (generated) {
      animationRef.current?.reset();
      animationRef.current?.play();
    }
  }, [generated]);

  return (
    <Pressable
      onPress={onGenerate}
      style={({ pressed }) => [
        { backgroundColor: pressed ? "#80d7ff" : "#47c5ff" },
        styles.generateButtonContainer,
      ]}
    >
      <View style={styles.generateButton}>
        <ThemedText style={styles.buttonText}>
          {generated ? "Copied" : "Generate"}
        </ThemedText>
        {generated && (
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
  buttonText: {
    color: "white",
    fontFamily: "semiBold",
    fontSize: FONT_SIZE.tiny,
  },
});
