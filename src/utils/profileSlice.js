import { createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    activeProfile: null,
  },
  reducers: {
    setActiveProfile: (state, action) => {
      state.activeProfile = action.payload;
    },
    clearActiveProfile: (state) => {
      state.activeProfile = null;
    },
  },
});

export const { setActiveProfile, clearActiveProfile } = profileSlice.actions;
export default profileSlice.reducer;
