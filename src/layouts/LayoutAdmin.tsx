import { Layout } from "antd";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import HeaderAdmin from "../components/HeaderAdmin";

const LayoutAdmin: React.FC = () => {
  return (
    <Layout className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="h-14 flex items-center justify-between bg-white shadow-md">
        <HeaderAdmin />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />
        {/* Nội dung chính */}
        <div className="flex-1 h-full overflow-auto bg-[#F4F7FB]">
          <Outlet />
        </div>
      </div>
    </Layout>
  );
};

export default LayoutAdmin;
