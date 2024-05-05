import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  meta: {},
  oc: [],
};

const latestDataSlice = createSlice({
  name: "LatestData",
  initialState,
  reducers: {
    setLatestData: (state, action) => {
      state.meta = action.payload.meta;
      state.oc = action.payload.oc;
    },
  },
});

export const { setLatestData } = latestDataSlice.actions;

export default latestDataSlice.reducer;
