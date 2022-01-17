import type { Card, PlayedCard } from "../models";
import type { Bid, BidLevel, PlayerData, Trump } from "../store/features/game";

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

export const getHandPositions = (userId: string, players: PlayerData[]) => {
  if (!players) {
    return {};
  }
  let currentUserIdx = players.findIndex((player) => player.id === userId);

  return {
    userPosition: currentUserIdx % players.length,
    currentPlayerData: {
      position: currentUserIdx % players.length,
      playerData: players[currentUserIdx++ % players.length],
    },
    left: {
      position: currentUserIdx % players.length,
      playerData: players[currentUserIdx++ % players.length],
    },
    top: {
      position: currentUserIdx % players.length,
      playerData: players[currentUserIdx++ % players.length],
    },
    right: {
      position: currentUserIdx % players.length,
      playerData: players[currentUserIdx++ % players.length],
    },
  };
};

export const isInvalidPlayCard = (
  card: Card,
  isTrumpBroken: boolean,
  playedCards: PlayedCard[],
  latestBid: Bid,
  hand: Card[]
) => {
  if (
    !isTrumpBroken &&
    playedCards.length === 0 &&
    card.suit === latestBid?.trump
  ) {
    alert("You cannot start with the trump card!");
    return true;
  }
  if (
    hand.some((c) => c.suit === playedCards[0]?.suit) &&
    card.suit !== playedCards[0]?.suit
  ) {
    alert(`You must finish throwing ${playedCards[0]?.suit.toUpperCase()}!`);
    return true;
  }
  return false;
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
