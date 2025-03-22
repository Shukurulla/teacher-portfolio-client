import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
  name: "job",
  initialState: {
    isLoading: false,
    jobs: [],
  },
  reducers: {
    getJobsStart: (state) => {
      state.isLoading = true;
    },
    getJobsSuccess: (state, action) => {
      state.isLoading = false;
      state.jobs = action.payload;
    },
    getJobsFailure: (state) => {
      state.isLoading = false;
    },
  },
});

export const { getJobsFailure, getJobsStart, getJobsSuccess } =
  jobSlice.actions;

export default jobSlice.reducer;
