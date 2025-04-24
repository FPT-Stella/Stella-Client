import React from "react";
import { FaCircleUser } from "react-icons/fa6";
import { Dropdown, type MenuProps } from "antd";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userData");
    navigate("/login");
  };

  const items: MenuProps["items"] = [
    {
      key: "profile",
      label: (
        <span onClick={() => navigate("/profile")} className="px-4">
          Profile
        </span>
      ),
    },
    {
      key: "logout",
      label: (
        <span onClick={handleLogout} className="px-4">
          Logout
        </span>
      ),
    },
  ];

  return (
    <div className="bg-white w-full h-full flex">
      <div className="w-1/3 h-full flex gap-2 items-center pl-20 py-2.5">
        <img src={logo} alt="logo" className="w-10 h-10" />
        <div className="text-[#635BFF] h-full text-2xl font-bold italic flex justify-center items-center">
          Stella FPT
        </div>
      </div>
      <div className="w-1/3 h-full flex items-center pl-20 py-2.5 justify-center gap-5">
        <a
          onClick={() => navigate("/curriculum")}
          className="text-[#635BFF] h-full text-lg font-bold flex justify-center items-center cursor-pointer hover:text-blue-700"
        >
          Curriculum
        </a>
        <a
          onClick={() => navigate("/Syllabus")}
          className="text-[#635BFF] h-full text-lg font-bold flex justify-center items-center cursor-pointer hover:text-blue-700"
        >
          Syllabus
        </a>
      </div>
      <div className="w-1/3 h-full flex justify-end gap-2 items-center pr-20 py-2.5">
        <Dropdown menu={{ items }} placement="bottom">
          <div className="text-[#635BFF] h-full text-4xl italic flex justify-center items-center cursor-pointer">
            <FaCircleUser />
          </div>
        </Dropdown>
      </div>
    </div>
  );
}

export default Header;
