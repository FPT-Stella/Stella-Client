import React, { useEffect, useState } from "react";
import { getCurriculum } from "../../services/Curriculum";
import { Curriculum } from "../../models/Curriculum";
import { Table } from "antd";

function ManageCurriculum() {
  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const headerBg = "#f0f5ff"; // màu nền header
  const headerColor = "#1d39c4"; // màu chữ header

  useEffect(() => {
    const fetchCurriculums = async () => {
      try {
        const data = await getCurriculum();
        setCurriculums(data);
      } catch (err) {
        setError("Failed to fetch curriculums.");
      } finally {
        setLoading(false);
      }
    };

    fetchCurriculums();
  }, []);

  const columns = [
    {
      title: "Code",
      dataIndex: "curriculumCode",
      key: "curriculumCode",
      onHeaderCell: () => ({
        style: {
          backgroundColor: headerBg,
          color: headerColor,
          fontWeight: "bold",
        },
      }),
    },
    {
      title: "Name",
      dataIndex: "curriculumName",
      key: "curriculumName",
      render: (text: string) => <div className="line-clamp-3">{text}</div>,
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
      render: (text: string) => <div className="line-clamp-3">{text}</div>,
      onHeaderCell: () => ({
        style: {
          backgroundColor: headerBg,
          color: headerColor,
          fontWeight: "bold",
        },
      }),
    },
    {
      title: "Total Credit",
      dataIndex: "totalCredit",
      key: "totalCredit",
      onHeaderCell: () => ({
        style: {
          backgroundColor: headerBg,
          color: headerColor,
          fontWeight: "bold",
        },
      }),
    },
    {
      title: "Start Year",
      dataIndex: "startYear",
      key: "startYear",
      onHeaderCell: () => ({
        style: {
          backgroundColor: headerBg,
          color: headerColor,
          fontWeight: "bold",
        },
      }),
    },
    {
      title: "End Year",
      dataIndex: "endYear",
      key: "endYear",
      onHeaderCell: () => ({
        style: {
          backgroundColor: headerBg,
          color: headerColor,
          fontWeight: "bold",
        },
      }),
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="h-full flex flex-col px-10 py-5">
      <div className="text-lg font-semibold text-[#2A384D] h-8">
        Curriculum Management
      </div>

      <div className="flex-1 bg-white shadow-md rounded-md p-5">
        <Table
          dataSource={curriculums}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 3 }}
        />
      </div>
    </div>
  );
}

export default ManageCurriculum;
