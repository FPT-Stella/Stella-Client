import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spin, Table, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  getComboSubjectById,
  getSubjectsByComboId,
  getSubjectByID,
} from "../../services/Subject";
import { ComboSubject, Subject } from "../../models/Subject";

function ComboSubjects() {
  const { comboId } = useParams<{
    comboId: string;
  }>();
  const [combo, setCombo] = useState<ComboSubject | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const headerBg = "#f0f5ff";
  const headerColor = "#1d39c4";

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!comboId) return;

        // Fetch combo data
        const comboData = await getComboSubjectById(comboId);
        setCombo(comboData);

        // Get all subject IDs in this combo
        const subjectIds = await getSubjectsByComboId(comboId);

        // Fetch each subject's details
        const subjectPromises = subjectIds.map((item: any) =>
          getSubjectByID(item.subjectId),
        );

        const subjectData = await Promise.all(subjectPromises);
        setSubjects(subjectData);
        setFilteredSubjects(subjectData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [comboId]);

  const handleSearch = (value: string) => {
    setSearchText(value);
    const filtered = subjects.filter(
      (subject) =>
        subject.subjectCode.toLowerCase().includes(value.toLowerCase()) ||
        subject.subjectName.toLowerCase().includes(value.toLowerCase()),
    );
    setFilteredSubjects(filtered);
  };

  const subjectColumns: ColumnsType<Subject> = [
    {
      title: "Subject Code",
      dataIndex: "subjectCode",
      key: "subjectCode",
      width: "20%",
      onHeaderCell: () => ({
        style: {
          backgroundColor: headerBg,
          color: headerColor,
          fontWeight: "bold",
        },
      }),
      sorter: (a, b) => a.subjectCode.localeCompare(b.subjectCode),
    },
    {
      title: "Subject Name",
      dataIndex: "subjectName",
      key: "subjectName",
      width: "40%",
      onHeaderCell: () => ({
        style: {
          backgroundColor: headerBg,
          color: headerColor,
          fontWeight: "bold",
        },
      }),
    },
    {
      title: "Term",
      dataIndex: "termNo",
      key: "termNo",
      width: "15%",
      align: "center",
      sorter: (a, b) => a.termNo - b.termNo,
      onHeaderCell: () => ({
        style: {
          backgroundColor: headerBg,
          color: headerColor,
          fontWeight: "bold",
        },
      }),
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      width: "25%",
      onHeaderCell: () => ({
        style: {
          backgroundColor: headerBg,
          color: headerColor,
          fontWeight: "bold",
        },
      }),
      render: (text) => {
        try {
          return <div className="line-clamp-2">{JSON.parse(text)}</div>;
        } catch (e) {
          return <div className="line-clamp-2">{text}</div>;
        }
      },
    },
  ];

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spin size="large" tip="Loading subjects..." />
      </div>
    );
  }

  if (!combo) {
    return <div className="text-center text-red-500 mt-8">Combo not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            View Combo Details
          </h1>
          <p className="text-gray-600 mt-2">Combo: {combo.comboName}</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          placeholder="Search by subject code or name"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 300 }}
          className="rounded-none"
        />
      </div>

      {/* Subjects Table */}
      <div className="bg-white rounded-lg  p-6">
        <Table
          columns={subjectColumns}
          dataSource={filteredSubjects}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          className="border border-gray-200"
          size="middle"
          locale={{ emptyText: "No subjects found in this combo" }}
        />
      </div>
    </div>
  );
}

export default ComboSubjects;
