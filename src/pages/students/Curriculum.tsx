import { useState, useEffect } from "react";
import { getProgramsByMajor } from "../../services/Program";
import { Program } from "../../models/Program";
import { Curriculum } from "../../models/Curriculum";
import { Spin, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { getCurriculumByProgram } from "../../services/Curriculum";
import { Link } from "react-router-dom";

function CurriculumPage() {
  const studentInfo = {
    id: "929c9879-8f7d-4658-ba22-f63d4737945f",
    userId: "2ac1c89b-1667-481c-b8ea-d69350e023b3",
    majorId: "3e50ecf9-aa53-4ba8-8e2c-0ae0143145b4",
    studentCode: "SE171117",
    phone: "0902982731",
    address:
      "273 Nguyễn Văn Lượng, phường 21, Quận Gò Vấp, Thành phố Hồ Chí Minh",
  };

  const [program, setProgram] = useState<Program>({} as Program);
  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // First fetch program
        const programData = await getProgramsByMajor(studentInfo.majorId);
        setProgram(programData);

        // Then fetch curriculums for this program
        if (programData.id) {
          const curriculumData = await getCurriculumByProgram(programData.id);
          setCurriculums(curriculumData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentInfo.majorId]);

  const columns: ColumnsType<Curriculum> = [
    {
      title: "Curriculum Code",
      dataIndex: "curriculumCode",
      key: "curriculumCode",
      className: "font-medium",
      width: "15%",
    },
    {
      title: "Name",
      dataIndex: "curriculumName",
      key: "curriculumName",
      width: "25%",
      render: (text: string, record: Curriculum) => (
        <Link
          to={`/curriculum/${record.id}/`}
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          {text}
        </Link>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "35%",
      render: (text: string) => <div className="line-clamp-2">{text}</div>,
    },
    {
      title: "Total Credit",
      dataIndex: "totalCredit",
      key: "totalCredit",
      width: "10%",
      align: "center",
    },
    {
      title: "Year",
      key: "year",
      width: "15%",
      align: "center",
      render: (_, record) => (
        <span>{`${record.startYear} - ${record.endYear}`}</span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spin size="large" tip="Loading curriculum data..." />
      </div>
    );
  }

  if (error) {
    return <div className="my-12 mx-10 text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="my-12 mx-4 md:mx-8 lg:mx-16">
      {" "}
      {/* Increased horizontal margins */}
      <div className="text-4xl font-semibold text-center mb-8">Curriculum</div>
      {/* Program Information Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Your Program Information
        </h2>
        <table className="min-w-full border border-gray-200 bg-white">
          <tbody>
            <tr>
              <td className="py-4 border border-gray-200 px-6 font-medium w-48 bg-gray-50">
                Program Code:
              </td>
              <td className="py-4 border border-gray-200 px-6">
                {program.programCode}
              </td>
            </tr>
            <tr>
              <td className="py-4 border border-gray-200 px-6 font-medium w-48 bg-gray-50">
                Program Name:
              </td>
              <td className="py-4 border border-gray-200 px-6">
                {program.programName}
              </td>
            </tr>
            <tr>
              <td className="py-4 border border-gray-200 px-6 font-medium w-48 bg-gray-50">
                Description:
              </td>
              <td className="py-4 border border-gray-200 px-6">
                {program.description}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* Curriculums Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6">Available Curriculums</h2>
        <Table
          columns={columns}
          dataSource={curriculums}
          rowKey="id"
          pagination={{
            pageSize: curriculums.length,
            /* position: ["bottomCenter"],
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} curriculums`, */
          }}
          className="border border-gray-200"
          onRow={() => ({
            className: "hover:bg-gray-50 transition-colors cursor-pointer",
          })}
          scroll={{ x: 1000 }}
          size="large"
        />
      </div>
    </div>
  );
}

export default CurriculumPage;
