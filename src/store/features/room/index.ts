export {
  reducer,
  setGameIsConnected,
  setGameUsername,
  setGameRoomId,
  addPlayer,
  removePlayer,
  resetPlayers,
  setGameExists,
  setGameStatus,
  resetRoom,
} from "./roomSlice";

export type { GameStatus } from "./roomSlice";
