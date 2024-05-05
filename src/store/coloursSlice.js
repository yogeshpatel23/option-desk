import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ce: "#e7515a", // 231,81,90
  pe: "#2196f3", // 33,150,243
};

const coloursSlice = createSlice({
  name: "colors",
  initialState,
  reducers: {
    updateColor: (state, action) => {
      state.ce = action.payload.ce;
      state.pe = action.payload.pe;
    },
  },
});

export const { updateColor } = coloursSlice.actions;

export default coloursSlice.reducer;
