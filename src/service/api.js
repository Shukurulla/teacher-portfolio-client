import axios from "axios";

axios.defaults.baseURL = "https://server.portfolio-sport.uz";
axios.interceptors.request.use((option) => {
  const token = localStorage.getItem("teacher-jwt")
    ? localStorage.getItem("teacher-jwt")
    : "";
  option.headers.Authorization = `Bearer ${token}`;
  return option;
});
export default axios;
