import dayDataReducer from "./dayDataSlice";
import latestDataReducer from "./latestDataSlice";
import colorsReducer from "./coloursSlice";
import selectedIndexReducer from "./selectedIndexSlice";
import settingsReducer from "./settingsSlice";

const { configureStore } = require("@reduxjs/toolkit");

const store = configureStore({
  reducer: {
    latestData: latestDataReducer,
    dayData: dayDataReducer,
    colors: colorsReducer,
    selectedIndex: selectedIndexReducer,
    settings: settingsReducer,
  },
});

export default store;
