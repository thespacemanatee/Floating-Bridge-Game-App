import type { TrumpSuit } from "../store/features/game";

export const getUnicodeCharacter = (suit?: TrumpSuit) => {
  switch (suit) {
    case "c": {
      return "♣";
    }
    case "d": {
      return "♦";
    }
    case "h": {
      return "♥";
    }
    case "s": {
      return "♠";
    }
    case "n": {
      return "NT";
    }
    default: {
      return "";
    }
  }
};
