import { getstatistics, getBarChart } from "../../services/Dashboard";
import {
  Dashboard,
  StudentStatistics,
  StudentByMajor,
} from "../../models/User";
import { useEffect, useState } from "react";
import { Card, Spin } from "antd";
import { PiStudentFill } from "react-icons/pi";

function DashboardPage() {
  const [dashboard, setDashBoard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getstatistics();
        setDashBoard(data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  });
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spin size="large" tip="Loading curriculum details..." />
      </div>
    );
  }
  return (
    <div className="h-full flex flex-col px-10 py-5">
      <div className="text-lg font-semibold text-[#2A384D] h-8">Dashboard</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="shadow-md flex w-full h-12  bg-white">
          <div className="h-full w-8 flex justify-center items-center text-blue-600 bg-blue-100">
            <PiStudentFill />
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {dashboard?.totalStudents}
          </div>
        </div>

        <Card className="shadow-md">
          <div className="text-2xl font-bold text-green-600">
            {dashboard?.totalSubjects}
          </div>
        </Card>

        <Card className="shadow-md">
          <div className="text-2xl font-bold text-purple-600">
            {dashboard?.totalPrograms}
          </div>
        </Card>

        <Card className="shadow-md">
          <div className="text-2xl font-bold text-indigo-600">
            {dashboard?.totalCurriculums}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default DashboardPage;
