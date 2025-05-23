import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Spin, Table, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import { getProgramById } from "../../services/Program";
import { getComboSubjectByProgram } from "../../services/Subject";
import { Program } from "../../models/Program";
import { ComboSubject } from "../../models/Subject";
// import { DescriptionFormatter } from "../../components/Student/DescriptionFormatter";

function SubjectCombos() {
  const { programId } = useParams<{ programId: string }>();
  const [program, setProgram] = useState<Program | null>(null);
  const [combos, setCombos] = useState<ComboSubject[]>([]);
  const [filteredCombos, setFilteredCombos] = useState<ComboSubject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const headerBg = "#f0f5ff";
  const headerColor = "#1d39c4";

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!programId) return;

        // Fetch program data
        const programData = await getProgramById(programId);
        setProgram(programData);

        // Fetch subject combos
        const comboData = await getComboSubjectByProgram(programId);
        setCombos(comboData);
        setFilteredCombos(comboData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [programId]);

  const handleSearch = (value: string) => {
    setSearchText(value);
    const filtered = combos.filter((combo) =>
      combo.comboName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCombos(filtered);
  };

  const formatDescription = (text: string) => {
    try {
      // Check if it's a JSON string and parse it
      const content =
        typeof text === "string" && text.trim().startsWith("{")
          ? JSON.parse(text)
          : text;

      return (
        <div className="line-clamp-3 prose prose-sm max-w-none">
          {typeof content === "string" ? content : JSON.stringify(content)}
        </div>
      );
    } catch (e) {
      return <div className="line-clamp-3">{text}</div>;
    }
  };

  const comboColumns: ColumnsType<ComboSubject> = [
    {
      title: "Combo Name",
      dataIndex: "comboName",
      key: "comboName",
      width: "15%",
      className: "font-medium",
      onHeaderCell: () => ({
        style: {
          backgroundColor: headerBg,
          color: headerColor,
          fontWeight: "bold",
        },
      }),
      render: (text, record) => (
        <Link
          to={`/program/${programId}/combos/${record.id}/subjects`}
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
      align: "left",
      onHeaderCell: () => ({
        style: {
          backgroundColor: headerBg,
          color: headerColor,
          fontWeight: "bold",
        },
      }),
      onCell: () => ({
        style: {
          verticalAlign: "top",
        },
      }),
    },
    {
      title: "Program Outcome",
      dataIndex: "programOutcome",
      key: "programOutcome",
      width: "30%",
      onHeaderCell: () => ({
        style: {
          backgroundColor: headerBg,
          color: headerColor,
          fontWeight: "bold",
        },
      }),
      render: (text) => formatDescription(text),
    },
  ];

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spin size="large" tip="Loading subject combos..." />
      </div>
    );
  }

  if (!program) {
    return (
      <div className="text-center text-red-500 mt-8">Program not found</div>
    );
  }

  return (
    <div className="my-12 mx-4 md:mx-8 lg:mx-16">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Combo Management</h1>
          <p className="text-gray-600 mt-2">
            Program: {program.programCode} - {program.programName}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          placeholder="Search by combo name"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 350 }}
          className="rounded-none"
        />
      </div>

      {/* Combos Table */}
      <div className="bg-white rounded-lg  py-6">
        <Table
          columns={comboColumns}
          dataSource={filteredCombos}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          className=""
          size="middle"
          locale={{ emptyText: "No subject combinations found" }}
        />
      </div>
    </div>
  );
}

export default SubjectCombos;
