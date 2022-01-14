import React from "react";

import { AnimatedBackCard } from "../components/molecules/AnimatedBackCard";
import {
  BACK_CARD_OFFSET_X,
  CARD_OFFSET_Y,
  CARD_ROTATION,
} from "../config/Constants";
import type { PlayerData } from "../store/features/game";

type OpponentHandProps = {
  playerData: PlayerData;
};

export const OpponentHand = ({ playerData }: OpponentHandProps) => {
  return (
    <>
      {playerData.hand.map((card, index, hand) => {
        const noOfCards = hand.length;
        const translateX =
          BACK_CARD_OFFSET_X * (index - Math.floor(noOfCards / 2));
        const translateY =
          -CARD_OFFSET_Y * Math.pow(index - Math.floor(noOfCards / 2), 2);
        const rotate =
          -CARD_ROTATION * ((index - Math.floor(noOfCards / 2)) / noOfCards);
        return (
          <AnimatedBackCard
            key={`${card.suit}${card.value}`}
            index={index}
            offsetX={translateX}
            offsetY={translateY}
            offsetRotate={rotate}
          />
        );
      })}
    </>
  );
};
