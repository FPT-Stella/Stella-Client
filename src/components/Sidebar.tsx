import React, { useEffect, useState } from "react";
import { FaChartBar, FaUsers } from "react-icons/fa";
import { FaBookOpenReader } from "react-icons/fa6";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { PiStudentFill } from "react-icons/pi";
import { MdOutlineViewTimeline } from "react-icons/md";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { MdOutlineMenuBook } from "react-icons/md";
import { FaPenRuler } from "react-icons/fa6";

interface SidebarDataType {
  icon: React.ElementType;
  heading: string;
  href: string;
}

const SidebarData: SidebarDataType[] = [
  {
    icon: FaChartBar,
    heading: "Dashboard",
    href: "/dashboard",
  },

  {
    icon: FaUsers,
    heading: "Student",
    href: "/manageStudent",
  },

  {
    icon: FaPenRuler,
    heading: "Tool",
    href: "/manageTool",
  },

  {
    icon: MdOutlineMenuBook,
    heading: "Subject",
    href: "/manageSubject",
  },

  {
    icon: FaBookOpenReader,
    heading: "Curriculum",
    href: "/manageCurriculum",
  },
  {
    icon: MdOutlineViewTimeline,
    heading: "Program",
    href: "/manageProgram",
  },
  {
    icon: PiStudentFill,
    heading: "Major",
    href: "/manageMajor",
  },
];

const Sidebar = () => {
  const [active, setActive] = useState<string>(window.location.pathname);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    setActive(window.location.pathname);
  }, []);

  const handleNavigation = (href: string) => {
    setActive(href);
    navigate(href);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  const handleLogout = () => {
    localStorage.clear();

    navigate(`/`);
  };

  return (
    <div
      className={`h-full bg-white shadow-lg flex flex-col ${
        isCollapsed ? "w-20" : "w-64"
      } transition-all duration-300`}
    >
      {/* Navigation Section */}
      <nav className="flex-1 px-4 py-5">
        <ul className="space-y-2">
          {SidebarData.map((item) => (
            <li key={item.heading}>
              <div
                onClick={() => handleNavigation(item.href)}
                className={`flex items-center text-sm font-medium rounded-lg px-4 py-2 cursor-pointer ${
                  active.startsWith(item.href)
                    ? "bg-[#635BFF] text-white"
                    : "text-[#2A384D] hover:text-[#635BFF] hover:bg-gray-100"
                }`}
              >
                <div className="mr-3 text-lg">
                  <item.icon />
                </div>
                {!isCollapsed && <span>{item.heading}</span>}
              </div>
            </li>
          ))}
        </ul>
      </nav>

      {/* Toggle Button */}
      <div className="px-4 py-3">
        <button
          className="w-full flex items-center font-semibold justify-center bg-[#635BFF] text-white rounded-lg py-2 hover:bg-[#8b85f6] mb-4 gap-2"
          onClick={handleLogout}
        >
          <RiLogoutCircleRLine className="text-xl font-semibold " />
          {!isCollapsed && <span>Log out</span>}
        </button>
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center text-xl justify-center text-[#635BFF] bg-gray-100 rounded-lg py-2 hover:bg-gray-200"
        >
          {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
