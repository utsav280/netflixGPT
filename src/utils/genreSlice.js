import { createSlice } from "@reduxjs/toolkit";

const genreSlice = createSlice({
  name: "genre",
  initialState: {
    genreList: [],
    selectedGenreId: null,
  },
  reducers: {
    setGenreList: (state, action) => {
      state.genreList = action.payload;
    },
    setSelectedGenre: (state, action) => {
      // Toggle off if same genre clicked
      state.selectedGenreId =
        state.selectedGenreId === action.payload ? null : action.payload;
    },
    clearGenre: (state) => {
      state.selectedGenreId = null;
    },
  },
});

export const { setGenreList, setSelectedGenre, clearGenre } = genreSlice.actions;
export default genreSlice.reducer;
