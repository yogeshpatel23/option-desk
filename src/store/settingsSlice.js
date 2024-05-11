import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showVol: true,
  showOiGraph: false,
  noc: 5,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    updateSettings: (state, action) => {
      state.showOiGraph = action.payload.showOiGraph;
      state.showVol = action.payload.showVol;
      state.noc = action.payload.noc;
    },
  },
});

export const { updateSettings } = settingsSlice.actions;

export default settingsSlice.reducer;
