import { toast } from "react-hot-toast";
import {
  getUserFailure,
  getUserStart,
  getUserSuccess,
} from "../redux/slice/user.slice";
import axios from "./api.js";

const UserService = {
  async postUser(dispatch, user, navigate) {
    dispatch(getUserStart());
    try {
      const { data } = await axios.post("/teacher/create", user);
      if (data.token) {
        localStorage.setItem("teacher-jwt", data.token);
      }
      dispatch(getUserSuccess(data.data));
      navigate("/");
      setTimeout(() => {
        return toast.success("Registratsiyadan muaffaqqiyatli o'tdingiz");
      }, 200);
    } catch (error) {
      console.log(error);
      dispatch(getUserFailure());
    }
  },
  async getUser(dispatch, navigate) {
    dispatch(getUserStart());
    try {
      const { data } = await axios.get("/teacher/profile");

      dispatch(getUserSuccess(data.data));
    } catch (error) {
      console.log(error);
      navigate("/auth/login");
      dispatch(getUserFailure());
    }
  },
};
export default UserService;
