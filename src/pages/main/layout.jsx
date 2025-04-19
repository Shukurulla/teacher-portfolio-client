import React from "react";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import { useNavigate } from "react-router-dom";

const Layout = ({ activePage }) => {
  const navigate = useNavigate();
  const path = window.location.pathname;

  return (
    <div>
      <Navbar />
      <div className="row gap-0">
        <div className="col-lg-2 shadow-md m-0 p-0 col-md-4 col-sm-12">
          <Sidebar />
        </div>
        <div className="col-lg-10 p-0 col-md-8 col-sm-12">
          <div className=" relative bg-gray-50 overflow-y-scroll h-[90vh]">
            {path == "/" ? (
              ""
            ) : (
              <button
                className="py-3 px-5 text-blue-600"
                onClick={() => navigate(-1)}
              >
                <i className="bi bi-arrow-left"></i> orqaga
              </button>
            )}
            {activePage}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
