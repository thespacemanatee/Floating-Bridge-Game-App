export {
  reducer,
  setGameId,
  setGameStatus,
  setGamePlayerData,
  setGameRoundNo,
  setGameUserPosition,
  setGameCurrentPosition,
  setGameLatestBid,
  setGameBidSequence,
  setGameIsBidding,
  setGamePartner,
  setGameIsTrumpBroken,
  setGamePlayedCards,
  resetGame,
} from "./gameSlice";

export type {
  GameStatus,
  Player,
  PlayerData,
  Partner,
  PlayCardPayload,
  Trump,
  BidLevel,
  Bid,
} from "./gameSlice";
