import React from "react";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";

const Layout = ({ activePage }) => {
  return (
    <div>
      <Navbar />
      <div className="row gap-0">
        <div className="col-lg-3 shadow-md m-0 p-0 col-md-4 col-sm-12">
          <Sidebar />
        </div>
        <div className="col-lg-9 p-0 col-md-8 col-sm-12">
          <div className="p-4 relative bg-[#96999b48] overflow-y-scroll h-[90vh]">
            {activePage}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
