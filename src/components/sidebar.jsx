import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const navItems = [
    {
      label: "Bosh sahifa",
      path: "/",
      icon: "bi-house",
    },
    {
      label: "Yutuqlar",
      path: "/achievments",
      icon: "bi-award",
    },
    {
      label: "Profil",
      path: "/profile",
      icon: "bi-award",
    },
  ];
  return (
    <div className="mt-2">
      <ul>
        {navItems.map((item) => (
          <Link
            to={item.path}
            className="px-4 p-2 font-semibold flex gap-2 text-[18px] hover:bg-[#96999b48]"
          >
            <i className={`bi ${item.icon}`}></i>
            <span>{item.label}</span>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
