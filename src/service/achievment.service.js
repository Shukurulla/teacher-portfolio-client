import { toast } from "react-hot-toast";
import {
  getAchievmentsFailure,
  getAchievmentsStart,
  getAchievmentsSuccess,
} from "../redux/slice/achievments.slice";
import axios from "./api.js";

const AchievmentService = {
  async getAchievments(dispatch) {
    dispatch(getAchievmentsStart());
    try {
      const { data } = await axios.get("/achievments");
      dispatch(getAchievmentsSuccess(data.data));
    } catch (error) {
      console.log(error);
      dispatch(getAchievmentsFailure());
    }
  },
};

export default AchievmentService;
