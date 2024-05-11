import { createSlice } from "@reduxjs/toolkit";

const initialState = "nifty";

const selectedIndexSlice = createSlice({
  name: "selectedIndex",
  initialState,
  reducers: {
    setIndex: (state, action) => action.payload,
  },
});

export const { setIndex } = selectedIndexSlice.actions;

export default selectedIndexSlice.reducer;
