import { createSlice } from "@reduxjs/toolkit";

const gptSlice = createSlice({
  name: "gpt",
  initialState: {
    showGPTSearch: false,
    movieNames: null,
    movieResults: null,
    // Chat history for conversational mode
    chatHistory: [], // [{ role: "user"|"assistant", text: string, movies?: [] }]
    isChatMode: false,
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
    removeGptMovieResults: (state) => {
      state.movieNames = null;
      state.movieResults = null;
    },
    addChatMessage: (state, action) => {
      state.chatHistory.push(action.payload);
    },
    clearChatHistory: (state) => {
      state.chatHistory = [];
      state.movieNames = null;
      state.movieResults = null;
    },
    setChatMode: (state, action) => {
      state.isChatMode = action.payload;
    },
  },
});

export const {
  toggleGptSearch,
  addGptMovieResults,
  removeGptMovieResults,
  addChatMessage,
  clearChatHistory,
  setChatMode,
} = gptSlice.actions;

export default gptSlice.reducer;
