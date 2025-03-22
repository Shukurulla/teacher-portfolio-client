import { toast } from "react-hot-toast";
import {
  getAchievmentsFailure,
  getAchievmentsStart,
  getAchievmentsSuccess,
} from "../redux/slice/achievments.slice";
import axios from "./api.js";

const AchievmentService = {
  async getAchievments(dispatch, id) {
    dispatch(getAchievmentsStart());
    try {
      const { data } = await axios.get("/achievments/" + id);
      console.log(id);

      dispatch(getAchievmentsSuccess(data.data));
    } catch (error) {
      console.log(error);
      dispatch(getAchievmentsFailure());
    }
  },
};

export default AchievmentService;
