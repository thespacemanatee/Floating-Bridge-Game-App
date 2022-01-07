import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import Pusher from "pusher-js/react-native";
import { HOST, AUTH_ENDPOINT, PUSHER_KEY, PUSHER_CLUSTER } from "@env";

import Main from "./src/Main";
import { pusherRef } from "./src/utils/PusherHelper";

export default function App() {
  const [loaded] = useFonts({
    black: require("./assets/fonts/Poppins-Black.ttf"),
    blackItalic: require("./assets/fonts/Poppins-BlackItalic.ttf"),
    bold: require("./assets/fonts/Poppins-Bold.ttf"),
    boldItalic: require("./assets/fonts/Poppins-BoldItalic.ttf"),
    extraBold: require("./assets/fonts/Poppins-ExtraBold.ttf"),
    extraBoldItalic: require("./assets/fonts/Poppins-ExtraBoldItalic.ttf"),
    extraLight: require("./assets/fonts/Poppins-ExtraLight.ttf"),
    extraLightItalic: require("./assets/fonts/Poppins-ExtraLightItalic.ttf"),
    italic: require("./assets/fonts/Poppins-Italic.ttf"),
    light: require("./assets/fonts/Poppins-Light.ttf"),
    lightItalic: require("./assets/fonts/Poppins-LightItalic.ttf"),
    medium: require("./assets/fonts/Poppins-Medium.ttf"),
    mediumItalic: require("./assets/fonts/Poppins-MediumItalic.ttf"),
    regular: require("./assets/fonts/Poppins-Regular.ttf"),
    semiBold: require("./assets/fonts/Poppins-SemiBold.ttf"),
    semiBoldItalic: require("./assets/fonts/Poppins-SemiBoldItalic.ttf"),
    thin: require("./assets/fonts/Poppins-Thin.ttf"),
    thinItalic: require("./assets/fonts/Poppins-ThinItalic.ttf"),
  });

  useEffect(() => {
    pusherRef.current = new Pusher(PUSHER_KEY, {
      authEndpoint: HOST + AUTH_ENDPOINT,
      cluster: PUSHER_CLUSTER,
    });
  }, []);

  if (!loaded) return null;

  return <Main />;
}
