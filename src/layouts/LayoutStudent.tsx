import Header from "../components/Header";
import { Layout } from "antd";
import ChatBox from "../components/ChatBox/ChatBox";
import { Outlet } from "react-router-dom";
const { Content } = Layout;
const LayoutStudent: React.FC = () => {
  return (
    <Layout className="overflow-hidden h-screen flex flex-col bg-white">
      <div className="h-20 flex items-center justify-between bg-white">
        <Header />
      </div>

      <Content className={` overflow-auto `}>
        <div className="flex flex-col min-h-screen bg-white">
          <div className="flex-1 overflow-auto">
            <Outlet />
            <ChatBox />
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default LayoutStudent;
