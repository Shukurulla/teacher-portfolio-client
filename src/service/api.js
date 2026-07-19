import axios from "axios";

axios.defaults.baseURL = "http://localhost:7474";
axios.interceptors.request.use((option) => {
  const token = localStorage.getItem("teacher-jwt")
    ? localStorage.getItem("teacher-jwt")
    : "";
  option.headers.Authorization = `Bearer ${token}`;
  return option;
});

// Token yaroqsiz yoki foydalanuvchi o'chirilgan bo'lsa (401/403) —
// tokenni tozalab, login sahifasiga qaytaramiz.
axios.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("teacher-jwt");
      if (!window.location.pathname.startsWith("/auth/")) {
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  },
);

export default axios;
