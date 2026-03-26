import { configureStore } from "@reduxjs/toolkit";
import movieReducer from "./movieSlice";
import userReducer from "./userSlice";
import gptReducer from "./gptSlice";
import configReducer from "./configSlice";
import watchlistReducer from "./watchlistSlice";
import toastReducer from "./toastSlice";
import genreReducer from "./genreSlice";
import profileReducer from "./profileSlice";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    movies: movieReducer,
    gpt: gptReducer,
    config: configReducer,
    watchlist: watchlistReducer,
    toast: toastReducer,
    genre: genreReducer,
    profile: profileReducer,
  },
});

export default appStore;
