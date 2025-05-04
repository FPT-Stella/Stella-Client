import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spin, Table, Checkbox } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  getPOByProgramId,
  getPloByCurriculum,
  getMappingByPLO,
} from "../../services/PO_PLO";
import { getProgramById } from "../../services/Program";
import { Program } from "../../models/Program";
import { PO, PLO } from "../../models/PO_PLO";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface MappingMatrix {
  [key: string]: {
    [key: string]: boolean;
  };
}

function POStudent() {
  const { programId, curriculumId } = useParams<{
    programId: string;
    curriculumId: string;
  }>();
  const navigate = useNavigate();
  const [pos, setPOs] = useState<PO[]>([]);
  const [plos, setPLOs] = useState<PLO[]>([]);
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [mappingMatrix, setMappingMatrix] = useState<MappingMatrix>({});
  const headerBg = "#f0f5ff";
  const headerColor = "#1d39c4";

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!programId || !curriculumId) return;

        setLoading(true);
        // Fetch all required data in parallel
        const [programData, poData, ploData] = await Promise.all([
          getProgramById(programId),
          getPOByProgramId(programId),
          getPloByCurriculum(curriculumId),
        ]);

        setProgram(programData);
        setPOs(poData);
        setPLOs(ploData);

        // Create mapping matrix
        const matrix: MappingMatrix = {};

        // Initialize matrix with false values
        for (const plo of ploData) {
          matrix[plo.id] = {};
          for (const po of poData) {
            matrix[plo.id][po.id] = false;
          }
        }

        // Fetch mapping data for each PLO
        const mappingPromises = poData.map((po) => getMappingByPLO(po.id));
        const mappingResults = await Promise.all(mappingPromises);

        // Update matrix with mapping data
        mappingResults.forEach((ploIds, index) => {
          const currentPoId = poData[index].id;
          // ploIds is an array of PLO IDs that map to this PO
          ploIds.forEach((ploId: string) => {
            if (matrix[ploId]) {
              // Check if the PLO exists in our matrix
              matrix[ploId][currentPoId] = true;
            }
          });
        });

        setMappingMatrix(matrix);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [programId, curriculumId]);

  const ploColumns: ColumnsType<PLO> = [
    {
      title: "PLO Name",
      dataIndex: "ploName",
      key: "ploName",
      width: "30%",
      className: "font-medium",
      onHeaderCell: () => ({
        style: {
          backgroundColor: headerBg,
          color: headerColor,
          fontWeight: "bold",
        },
      }),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "70%",
      onHeaderCell: () => ({
        style: {
          backgroundColor: headerBg,
          color: headerColor,
          fontWeight: "bold",
        },
      }),
    },
  ];

  const poColumns: ColumnsType<PO> = [
    {
      title: "PO Name",
      dataIndex: "poName",
      key: "poName",
      width: "30%",
      className: "font-medium",
      onHeaderCell: () => ({
        style: {
          backgroundColor: headerBg,
          color: headerColor,
          fontWeight: "bold",
        },
      }),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "70%",
      onHeaderCell: () => ({
        style: {
          backgroundColor: headerBg,
          color: headerColor,
          fontWeight: "bold",
        },
      }),
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

  // Generate mapping table columns
  const mappingColumns = [
    {
      title: "PLO / PO",
      dataIndex: "ploName",
      key: "ploName",
      fixed: true,
      width: 300,
      onHeaderCell: () => ({
        style: {
          backgroundColor: headerBg,
          color: headerColor,
          fontWeight: "bold",
        },
      }),
      render: (text: string, record: PLO) => (
        <div className="px-4 py-2">
          <div className="font-medium text-gray-900">{text}</div>
          <div className="text-sm text-gray-500 line-clamp-2">
            {record.description}
          </div>
        </div>
      ),
    },
    ...pos.map((po) => ({
      title: (
        <div className="text-center px-2">
          <div>{po.poName}</div>
        </div>
      ),
      key: po.id,
      width: 150,
      align: "center" as const,
      onHeaderCell: () => ({
        style: {
          backgroundColor: headerBg,
          color: headerColor,
          fontWeight: "bold",
        },
      }),
      render: (_: any, record: PLO) => (
        <Checkbox
          checked={mappingMatrix[record.id]?.[po.id] || false}
          disabled
          className="scale-125"
        />
      ),
    })),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <ToastContainer />
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

      {/* PLO Table Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6 text-gray-700">
          Program Learning Outcomes (PLOs)
        </h2>
        <Table
          columns={ploColumns}
          dataSource={plos}
          rowKey="id"
          pagination={false}
          className="border border-gray-200"
          size="middle"
        />
      </div>

      {/* PO Table Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6 text-gray-700">
          Program Outcomes (POs)
        </h2>
        <Table
          columns={poColumns}
          dataSource={pos}
          rowKey="id"
          pagination={false}
          className="border border-gray-200"
          size="middle"
        />
      </div>

      {/* Mapping Matrix Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-700">
          Mapping POs to PLOs
        </h2>
        <div className="overflow-x-auto">
          <Table
            columns={mappingColumns}
            dataSource={plos}
            rowKey="id"
            pagination={false}
            scroll={{ x: "max-content" }}
            className="border border-gray-200"
            size="large"
            rowClassName="hover:bg-gray-50"
            style={{ minWidth: "100%" }}
          />
        </div>
      </div>
    </div>
  );
}

export default POStudent;
