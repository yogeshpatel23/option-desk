import { configureStore } from "@reduxjs/toolkit";
import ThemeReducer from "./themeSlice";
import LatestDataReducer from "./LatestDataSlice";

const store = configureStore({
  reducer: {
    theme: ThemeReducer,
    latestData : LatestDataReducer
  },
});

export default store;
