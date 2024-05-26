import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const selectedStrickSlice = createSlice({
  name: "selectedStrick",
  initialState,
  reducers: {
    setStricks: (state, action) => action.payload,
  },
});

export const { setStricks } = selectedStrickSlice.actions;

export default selectedStrickSlice.reducer;
