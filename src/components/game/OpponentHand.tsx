import React from "react";

import { AnimatedBackCard } from "../molecules/AnimatedBackCard";
import {
  BACK_CARD_OFFSET_X,
  CARD_OFFSET_Y,
  CARD_ROTATION,
} from "../../config/Constants";
import type { Card } from "../../models";

type OpponentHandProps = {
  hand: Card[];
  scaleSize?: number;
};

export const OpponentHand = ({ hand, scaleSize = 1 }: OpponentHandProps) => {
  return (
    <>
      {hand.map((card, index) => {
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
            scaleSize={scaleSize}
            offsetX={translateX}
            offsetY={translateY}
            offsetRotate={rotate}
          />
        );
      })}
    </>
  );
};
