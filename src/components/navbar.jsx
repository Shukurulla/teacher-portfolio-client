import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiLogOut } from "react-icons/fi";
import { useDispatch } from "react-redux";

const Navbar = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm py-3 sticky top-0 z-50">
      <div className=" mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-gray-800 hover:text-primary transition-colors"
        >
          Teacher<span className="text-primary">Portfolio</span>
        </Link>

        {/* User Profile */}
        <div className="flex items-center space-x-2">
          {user ? (
            <div className="relative group">
              <button className="flex items-center space-x-2 focus:outline-none">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
                  <img
                    src={
                      user.profileImage ||
                      "https://as2.ftcdn.net/jpg/05/89/93/27/1000_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg"
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-medium text-gray-700 hidden md:inline-block">
                  {user.firstName} {user.lastName}
                </span>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200">
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FiUser className="mr-2" />
                  Profil
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FiLogOut className="mr-2" />
                  Chiqish
                </button>
              </div>
            </div>
          ) : (
            <div className="flex space-x-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
              >
                Kirish
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors"
              >
                Ro'yxatdan o'tish
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
