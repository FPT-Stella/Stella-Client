import Header from "../components/Header";
import { Layout } from "antd";

import { Outlet } from "react-router-dom";
const { Content } = Layout;
const LayoutStudent: React.FC = () => {
  return (
    <Layout className="overflow-hidden h-screen flex flex-col bg-white">
      <Header />
      <Content className={` overflow-auto `}>
        <div className="flex flex-col min-h-screen">
          <div className="flex-1 overflow-auto">
            <Outlet />
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default LayoutStudent;
