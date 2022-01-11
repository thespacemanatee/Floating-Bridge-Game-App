import React from "react";

import { AnimatedFaceCard } from "../components/molecules/AnimatedFaceCard";
import { deck } from "../models/deck";
import type { GameHand } from "../store/features/game/gameSlice";

import { CARD_OFFSET_X, CARD_OFFSET_Y, CARD_ROTATION } from "./Game";

type CurrentPlayerHandProps = {
  gameHand: GameHand;
  isActive: boolean;
  onPlayCard: (index: number) => void;
};

export const CurrentPlayerHand = ({
  gameHand,
  isActive,
  onPlayCard,
}: CurrentPlayerHandProps) => {
  return (
    <>
      {gameHand.hand.map((card, index, hand) => {
        const noOfCards = hand.length;
        const translateX = CARD_OFFSET_X * (index - Math.floor(noOfCards / 2));
        const translateY =
          CARD_OFFSET_Y * Math.pow(index - Math.floor(noOfCards / 2), 2);
        const rotate =
          CARD_ROTATION * ((index - Math.floor(noOfCards / 2)) / noOfCards);
        return (
          <AnimatedFaceCard
            index={index}
            key={`${card.suit}${card.value}`}
            image={deck[`${card.suit}${card.value}`].imageUri}
            offsetX={translateX}
            offsetY={translateY}
            offsetRotate={rotate}
            enabled={isActive}
            onSnapToMiddle={onPlayCard}
          />
        );
      })}
    </>
  );
};
