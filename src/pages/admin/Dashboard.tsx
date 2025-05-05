import { getstatistics, getBarChart } from "../../services/Dashboard";
import { Dashboard, StudentStatistics } from "../../models/User";
import { useEffect, useState } from "react";
import { Spin } from "antd";
import { PiStudentFill } from "react-icons/pi";
import { FaBookOpenReader, FaSwatchbook } from "react-icons/fa6";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

function DashboardPage() {
  const [dashboard, setDashBoard] = useState<Dashboard | null>(null);
  const [studentStats, setStudentStats] = useState<StudentStatistics | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#8dd1e1",
    "#a4de6c",
    "#d0ed57",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardData = await getstatistics();
        const studentData = await getBarChart();
        setDashBoard(dashboardData);
        setStudentStats(studentData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

      {/* Các thẻ thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
        <div className="shadow-md flex w-full h-24 rounded-lg p-2 bg-white gap-5">
          <div className="h-full w-1/4 text-5xl flex justify-center items-center text-blue-600 bg-blue-100">
            <PiStudentFill />
          </div>
          <div className="text-blue-600">
            <div className="text-xl font-semibold">Total Students:</div>
            <div className="text-2xl font-bold mt-2">
              {dashboard?.totalStudents}
            </div>
          </div>
        </div>

        <div className="shadow-md flex w-full h-24 rounded-lg p-2 bg-white gap-5">
          <div className="h-full w-1/4 text-5xl flex justify-center items-center text-green-500 bg-green-100">
            <FaBookOpenReader />
          </div>
          <div className="text-green-500">
            <div className="text-xl font-semibold">Total Subjects:</div>
            <div className="text-2xl font-bold mt-2">
              {dashboard?.totalSubjects}
            </div>
          </div>
        </div>

        <div className="shadow-md flex w-full h-24 rounded-lg p-2 bg-white gap-5">
          <div className="h-full w-1/4 text-5xl flex justify-center items-center text-pink-400 bg-pink-100">
            <PiStudentFill />
          </div>
          <div className="text-pink-500">
            <div className="text-xl font-semibold">Total Programs:</div>
            <div className="text-2xl font-bold mt-2">
              {dashboard?.totalPrograms}
            </div>
          </div>
        </div>

        <div className="shadow-md flex w-full h-24 rounded-lg p-2 bg-white gap-5">
          <div className="h-full w-1/4 text-5xl flex justify-center items-center text-orange-400 bg-orange-100">
            <FaSwatchbook />
          </div>
          <div className="text-orange-400">
            <div className="text-xl font-semibold">Total Curriculums:</div>
            <div className="text-2xl font-bold mt-2">
              {dashboard?.totalCurriculums}
            </div>
          </div>
        </div>
      </div>

      {studentStats && studentStats.studentsByMajor.length > 0 && (
        <div className="mt-10 bg-white px-16 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-[#2A384D] my-4 text-center">
            Diagram showing students by major
          </h2>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart
              data={studentStats.studentsByMajor}
              margin={{ top: 10, right: 30, left: 0, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="majorName" interval={0} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="studentCount">
                {studentStats.studentsByMajor.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
