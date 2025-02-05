import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "./slice/user.slice.js";
import AchievmentReducer from "./slice/achievments.slice.js";
import FileReducer from "./slice/files.slice.js";

const store = configureStore({
  reducer: {
    user: UserReducer,
    achievment: AchievmentReducer,
    file: FileReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
