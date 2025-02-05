import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user } = useSelector((state) => state.user);
  return (
    <header className=" py-3 shadow-md mx-auto ">
      <div className="w-[90%] mx-auto flex items-center justify-between">
        <div className="logo">
          <Link to={"/"} className="text-[25px] font-bold hover:text-black">
            Teacher<span className="text-primary">Portfolio</span>
          </Link>
        </div>
        <div className="user text-[17px] font-semibold flex gap-2">
          <span className="username">{user.firstName}</span>
          <i className="bi bi-chevron-down"></i>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
