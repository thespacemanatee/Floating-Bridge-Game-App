import axios from "axios";
import { HOST } from "@env";

export const initialiseGame = (gameId: string) => {
  axios.post(HOST + "/game/init", {
    channelName: `presence-${gameId}`,
  });
};
