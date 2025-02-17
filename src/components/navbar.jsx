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
        <div className="user text-[17px] font-semibold items-center cursor-pointer flex gap-2">
          <img
            src="https://as2.ftcdn.net/jpg/05/89/93/27/1000_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg"
            alt=""
            width={40}
            height={40}
          />
          <span className="username">{user?.firstName}</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
