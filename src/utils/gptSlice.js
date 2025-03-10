import { createSlice } from "@reduxjs/toolkit";

const gptSlice = createSlice({
  name: "gpt",
  initialState: {
    showGPTSearch: false,
  },
  reducers: {
    toggleGptSearch: (state) => {
      state.showGPTSearch = !state.showGPTSearch;
    },
  },
});

export const { toggleGptSearch } = gptSlice.actions;
export default gptSlice.reducer;
