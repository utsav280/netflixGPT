import { createSlice } from "@reduxjs/toolkit";

const gptSlice = createSlice({
  name: "gpt",
  initialState: {
    showGPTSearch: false,
    movieNames: null,
    movieResults: null,
  },
  reducers: {
    toggleGptSearch: (state) => {
      state.showGPTSearch = !state.showGPTSearch;
    },
    addGptMovieResults: (state, action) => {
      const { movieNames, movieResults } = action.payload;
      state.movieNames = movieNames;
      state.movieResults = movieResults;
    },
    removeGptMovieResults: (state, action) => {
      state.movieNames = null;
      state.movieResults = null;
    },
  },
});

export const { toggleGptSearch, addGptMovieResults, removeGptMovieResults } =
  gptSlice.actions;
export default gptSlice.reducer;
