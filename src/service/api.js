import axios from "axios";

axios.defaults.baseURL = "http://45.134.39.117:7474";
axios.interceptors.request.use((option) => {
  const token = localStorage.getItem("teacher-jwt")
    ? localStorage.getItem("teacher-jwt")
    : "";
  option.headers.Authorization = `Bearer ${token}`;
  return option;
});
export default axios;
