import { configureStore } from "@reduxjs/toolkit";

import { reducer as gameReducer } from "./features/game";

export const store = configureStore({
  reducer: {
    game: gameReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
