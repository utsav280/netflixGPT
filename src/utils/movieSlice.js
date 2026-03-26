import { createSlice } from "@reduxjs/toolkit";

const movieSlice = createSlice({
  name: "movie",
  initialState: {
    nowPlayingMovies: null,
    trailer: null,
    selectedMovie: null,
  },
  reducers: {
    addNowPlayingMovies: (state, action) => {
      state.nowPlayingMovies = action.payload;
    },
    addPopularMovies: (state, action) => {
      state.popularMovies = action.payload;
    },
    addTopRatedMovies: (state, action) => {
      state.topRatedMovies = action.payload;
    },
    addUpcomingMovies: (state, action) => {
      state.upcomingMovies = action.payload;
    },
    addTrailer: (state, action) => {
      state.trailer = action.payload;
    },
    appendMovies: (state, action) => {
      const { category, movies } = action.payload;
      if (state[category]) {
        // Prevent dupes
        const existingIds = new Set(state[category].map((m) => m.id));
        const newMovies = movies.filter((m) => !existingIds.has(m.id));
        state[category] = [...state[category], ...newMovies];
      }
    },
    setSelectedMovie: (state, action) => {
      state.selectedMovie = action.payload;
    },
    clearSelectedMovie: (state) => {
      state.selectedMovie = null;
    },
  },
});

export const {
  addNowPlayingMovies,
  addPopularMovies,
  addTopRatedMovies,
  addUpcomingMovies,
  addTrailer,
  appendMovies,
  setSelectedMovie,
  clearSelectedMovie,
} = movieSlice.actions;
export default movieSlice.reducer;
