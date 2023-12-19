import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    symbol: {},
    oc: []
}

const LatestDataSlice = createSlice({
  name: 'LatestData',
  initialState,
  reducers: {
    setLatestData: (state,action) => {
        state.symbol = action.payload.putcall
        state.oc = action.payload.oc
    } 
  }
});

export const { setLatestData } = LatestDataSlice.actions

export default LatestDataSlice.reducer