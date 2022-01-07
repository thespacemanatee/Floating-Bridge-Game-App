import React, { useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import { SPACING } from "../resources/dimens";
import ThemedButton from "./elements/ThemedButton";
import ThemedText from "./elements/ThemedText";

import ThemedTextInput from "./elements/ThemedTextInput";

const LoginModal = () => {
  const [modalVisible, setModalVisible] = useState(true);
  const [text, setText] = useState("");

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        alert("Modal has been closed.");
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.container}>
        <View style={styles.modalView}>
          <ThemedText>Welcome to Singaporean Bridge!</ThemedText>
          <ThemedTextInput
            placeholder="Enter your name"
            onChangeText={setText}
            value={text}
            style={styles.input}
          />
          <ThemedTextInput
            placeholder="Enter your game room id"
            onChangeText={setText}
            value={text}
            style={styles.input}
          />
          <ThemedButton
            onPress={() => {
              setModalVisible(false);
            }}
            style={styles.loginButton}
          >
            <ThemedText>Login</ThemedText>
          </ThemedButton>
        </View>
      </View>
    </Modal>
  );
};

export default LoginModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00000099",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: SPACING.spacing_12,
    padding: SPACING.spacing_48,
    alignItems: "center",
  },
  input: {
    width: "100%",
  },
  loginButton: {
    width: "100%",
  },
});
