import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    putcall : [],
    oc: []
}

const DayDataSlice = createSlice({
  name: "DayData",
  initialState,
  reducers: {
    initDayData: (state,action) => {
        state.putcall = action.payload.putcall
        state.oc = action.payload.oc
    }
  }
});

export const { initDayData } = DayDataSlice.actions

export default DayDataSlice.reducer