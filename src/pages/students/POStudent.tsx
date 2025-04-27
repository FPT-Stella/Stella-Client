import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spin, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { getPOByProgramId } from "../../services/PO_PLO";
import { getProgramById } from "../../services/Program";
import { Program } from "../../models/Program";
import { PO } from "../../models/PO_PLO";

function POStudent() {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const [pos, setPOs] = useState<PO[]>([]);
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!programId) return;

        const [programData, poData] = await Promise.all([
          getProgramById(programId),
          getPOByProgramId(programId),
        ]);

        setProgram(programData);
        setPOs(poData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [programId]);

  const columns: ColumnsType<PO> = [
    {
      title: "PO Name",
      dataIndex: "poName",
      key: "poName",
      width: "30%",
      className: "font-medium",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "70%",
    },
  ];

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spin size="large" tip="Loading Program Outcomes..." />
      </div>
    );
  }

  if (!program) {
    return (
      <div className="text-center text-red-500 mt-8">Program not found</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-lg font-semibold h-8 flex gap-2 mb-3">
        <span className="text-gray-500 cursor-pointer" onClick={handleBack}>
          Curriculum Details /
        </span>
        <span className="text-[#2A384D]">Program Outcomes</span>
      </div>

      {/* Program Information */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6 text-gray-700 border-b pb-2">
          {program.programCode} - {program.programName}
        </h2>
      </div>

      {/* PO Table Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-700">
          Program Outcomes (POs)
        </h2>

        <Table
          columns={columns}
          dataSource={pos}
          rowKey="id"
          pagination={{
            pageSize: pos.length,
          }}
          className="border border-gray-200"
          size="large"
        />
      </div>
    </div>
  );
}

export default POStudent;
