import type { BidLevel, PlayerData, Trump } from "../store/features/game";

export const getUnicodeCharacter = (trump?: Trump) => {
  switch (trump) {
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

export const getColorFromUnicodeCharacter = (trump?: Trump) => {
  switch (trump) {
    case "d": {
      return "red";
    }
    case "h": {
      return "red";
    }
    default: {
      return "black";
    }
  }
};

export const getWinners = (
  level: BidLevel,
  players: PlayerData[],
  bidWinnerId: string,
  partnerId: string
) => {
  const partners = players.filter(
    (player) => player.id === bidWinnerId || player.id === partnerId
  );

  if (
    partners.reduce((total, curr) => total + curr.sets.length, 0) >=
    level + 6
  ) {
    return partners;
  }
  return players.filter(
    (player) => player.id !== bidWinnerId && player.id !== partnerId
  );
};
