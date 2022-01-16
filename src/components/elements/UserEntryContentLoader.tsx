import React from "react";
import { Rect, Circle } from "react-native-svg";

import { ContentLoader } from "../../index";

export const UserEntryContentLoader = () => (
  <ContentLoader
    speed={2}
    width={350}
    height={48}
    viewBox="0 0 350 48"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    <Rect x="60" y="10" rx="3" ry="3" width="290" height="8" />
    <Rect x="60" y="28" rx="3" ry="3" width="200" height="8" />
    <Circle cx="24" cy="24" r="24" />
  </ContentLoader>
);
