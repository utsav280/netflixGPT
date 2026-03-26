import { createSlice } from "@reduxjs/toolkit";

// Load initial state from localStorage
const loadFromStorage = () => {
  try {
    const serialized = localStorage.getItem("movieGPT_watchlist");
    return serialized ? JSON.parse(serialized) : [];
  } catch {
    return [];
  }
};

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState: {
    items: loadFromStorage(),
  },
  reducers: {
    addToWatchlist: (state, action) => {
      const exists = state.items.find((m) => m.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
        localStorage.setItem("movieGPT_watchlist", JSON.stringify(state.items));
      }
    },
    removeFromWatchlist: (state, action) => {
      state.items = state.items.filter((m) => m.id !== action.payload);
      localStorage.setItem("movieGPT_watchlist", JSON.stringify(state.items));
    },
  },
});

export const { addToWatchlist, removeFromWatchlist } = watchlistSlice.actions;
export default watchlistSlice.reducer;
