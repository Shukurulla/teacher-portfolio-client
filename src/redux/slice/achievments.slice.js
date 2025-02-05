import { createSlice } from "@reduxjs/toolkit";

const achievmetnSlice = createSlice({
  name: "achievment",
  initialState: {
    isLoading: false,
    achievments: [],
  },
  reducers: {
    getAchievmentsStart: (state) => {
      state.isLoading = true;
    },
    getAchievmentsSuccess: (state, action) => {
      state.isLoading = false;
      state.achievments = action.payload;
    },
    getAchievmentsFailure: (state) => {
      state.isLoading = false;
    },
  },
});

export const {
  getAchievmentsStart,
  getAchievmentsSuccess,
  getAchievmentsFailure,
} = achievmetnSlice.actions;

export default achievmetnSlice.reducer;
