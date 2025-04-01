import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiAward,
  FiUser,
  FiFileText,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import { useDispatch } from "react-redux";

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const navItems = [
    {
      label: "Bosh sahifa",
      path: "/",
      icon: <FiHome size={18} />,
    },
    {
      label: "Yutuqlar",
      path: "/achievments",
      icon: <FiAward size={18} />,
    },
    {
      label: "Profil",
      path: "/profile",
      icon: <FiUser size={18} />,
    },
  ];

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="w-64 bg-white shadow-sm h-full fixed left-0 top-0 pt-16">
      <div className="flex flex-col h-full">
        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-lg text-gray-700 transition-all
                ${
                  location.pathname === item.path
                    ? "bg-primary-50 text-primary font-medium"
                    : "hover:bg-gray-50 hover:text-gray-900"
                }`}
            >
              <span
                className={`mr-3 ${
                  location.pathname === item.path
                    ? "text-primary"
                    : "text-gray-500"
                }`}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="px-4 py-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all"
          >
            <span className="mr-3 text-gray-500">
              <FiLogOut size={18} />
            </span>
            <span>Chiqish</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
