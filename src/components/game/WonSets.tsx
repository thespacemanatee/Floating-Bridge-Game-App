import React, { memo, useMemo } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, { Layout, ZoomIn } from "react-native-reanimated";

import { PlayingCard } from "../elements";
import type { PlayedCard } from "../../models";
import { SPACING } from "../../resources";
import { FACE_CARD_ASPECT_RATIO } from "../../config/Constants";

type WonSetsProps = {
  sets: PlayedCard[][];
  current?: boolean;
  scaleSize?: number;
};

const areEqual = (prev: WonSetsProps, next: WonSetsProps) => {
  return prev.sets === next.sets;
};

export const WonSets = memo(
  ({ sets, current, scaleSize = 1 }: WonSetsProps) => {
    const { width: wWidth } = useWindowDimensions();
    const { cardHeight, cardWidth } = useMemo(() => {
      const cWidth = wWidth * 0.06 * scaleSize;
      return {
        cardHeight: cWidth * FACE_CARD_ASPECT_RATIO,
        cardWidth: cWidth,
      };
    }, [wWidth, scaleSize]);

    return (
      <View style={styles.container}>
        {sets.map((set, setIdx) => (
          <Animated.View
            key={setIdx}
            entering={ZoomIn}
            layout={Layout}
            style={{
              height: cardHeight,
              width: cardWidth,
            }}
          >
            {set.map((card) => (
              <PlayingCard
                key={`${card.suit}${card.value}`}
                style={[
                  {
                    bottom: current ? cardHeight : undefined,
                    top: !current ? cardHeight : undefined,
                    marginBottom: current ? SPACING.spacing24 : 0,
                    marginTop: !current ? SPACING.spacing24 : 0,
                    transform: [
                      {
                        rotate: `${
                          -10 + Math.random() * 20 + 90 * (setIdx % 2)
                        }deg`,
                      },
                    ],
                  },
                  styles.card,
                ]}
              />
            ))}
          </Animated.View>
        ))}
      </View>
    );
  },
  areEqual
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  card: {
    position: "absolute",
  },
});
