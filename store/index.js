import { configureStore } from "@reduxjs/toolkit";
import ThemeReducer from "./themeSlice";
import LatestDataReducer from "./LatestDataSlice";
import DayDataReducer from "./DayDataSlice";

const store = configureStore({
  reducer: {
    theme: ThemeReducer,
    latestData : LatestDataReducer,
    dayData: DayDataReducer
  },
});

export default store;
