import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
import CreateAchievment from "./pages/achievments/create.achievment";
import CreateAchievmetSection from "./pages/achievments/create.achievmet.section";
import Achievments from "./pages/main/achievments";
import Home from "./pages/main/home";
import Layout from "./pages/main/layout";
import RegisterPage from "./pages/sign/register.page";
import AchievmentService from "./service/achievment.service";
import UserService from "./service/user.service";
import LoginPage from "./pages/sign/login";
import EditProfile from "./pages/edit-profil/editProfile";
import JobPage from "./pages/jobs/job.page";
import Profile from "./pages/profile/profile";

const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { achievments } = useSelector((state) => state.achievment);
  useEffect(() => {
    if (!localStorage.getItem("teacher-jwt")) {
      return navigate("/auth/login");
    }
    UserService.getUser(dispatch, navigate);
  }, []);

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/" element={<Layout activePage={<Home />} />} />
        <Route
          path="/achievments"
          element={<Layout activePage={<Achievments />} />}
        />
        <Route
          path="/achievment/create/:id"
          element={<Layout activePage={<CreateAchievment />} />}
        />
        <Route
          path="/achievment/create/:id/section/:slug"
          element={
            <Layout
              activePage={achievments ? <CreateAchievmetSection /> : ""}
            />
          }
        />
        <Route
          path="/settings"
          element={<Layout activePage={<EditProfile />} />}
        />
        <Route path="/job/:id" element={<Layout activePage={<JobPage />} />} />
        <Route path="/profile" element={<Layout activePage={<Profile />} />} />
      </Routes>
    </>
  );
};

export default App;
