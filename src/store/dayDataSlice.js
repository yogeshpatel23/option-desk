import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  meta: [],
  oc: [],
};

const dayDataSlice = createSlice({
  name: "DayData",
  initialState,
  reducers: {
    initDayData: (state, action) => {
      state.meta = action.payload.meta;
      state.oc = action.payload.oc;
    },
    updateData: (state, action) => {
      state.meta.push(action.payload.meta);
      state.oc = [...state.oc, ...action.payload.oc];
    },
  },
});

export const { initDayData, updateData } = dayDataSlice.actions;

export default dayDataSlice.reducer;
