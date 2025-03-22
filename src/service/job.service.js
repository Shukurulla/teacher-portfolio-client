import {
  getJobsFailure,
  getJobsStart,
  getJobsSuccess,
} from "../redux/slice/jobs.slice";
import axios from "./api";

const JobService = {
  async getJobs(dispatch) {
    dispatch(getJobsStart());
    try {
      const { data } = await axios.get("/job/my-jobs");
      dispatch(getJobsSuccess(data.data));
    } catch (error) {
      console.log(error);
      dispatch(getJobsFailure());
    }
  },
  async createJob(dispatch, value) {
    dispatch(getJobsStart());
    try {
      await axios.post("/job/create", value);
      const { data } = await axios.get("/job/my-jobs");
      dispatch(getJobsSuccess(data.data));
    } catch (error) {
      console.log(error);
      dispatch(getJobsFailure());
    }
  },
};

export default JobService;
