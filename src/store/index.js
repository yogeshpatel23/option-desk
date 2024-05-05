import dayDataReducer from "./dayDataSlice";
import latestDataReducer from "./latestDataSlice";
import colorsReducer from "./coloursSlice";

const { configureStore } = require("@reduxjs/toolkit");

const store = configureStore({
  reducer: {
    latestData: latestDataReducer,
    dayData: dayDataReducer,
    colors: colorsReducer,
  },
});

export default store;
