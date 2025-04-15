import { Layout } from "antd";

import { Outlet } from "react-router-dom";
const { Content } = Layout;
const LayoutAdmin: React.FC = () => {
  return (
    <Layout className="overflow-hidden h-screen flex flex-col bg-white">
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

export default LayoutAdmin;
