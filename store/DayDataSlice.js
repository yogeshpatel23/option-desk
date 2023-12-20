import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  putcall: [],
  oc: [],
};

const DayDataSlice = createSlice({
  name: "DayData",
  initialState,
  reducers: {
    initDayData: (state, action) => {
      state.putcall = action.payload.putcall;
      state.oc = action.payload.oc;
    },
    updateData: (state, action) => {
      state.putcall.push(action.payload.putcall);
      state.oc.concat(action.payload.oc);
    },
  },
});

export const { initDayData, updateData } = DayDataSlice.actions;

export default DayDataSlice.reducer;
