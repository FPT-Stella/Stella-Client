import { useState } from "react";
import { Table, Input, Select, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { getSubject } from "../../services/Subject";
import { Subject } from "../../models/Subject";
import { Link } from "react-router-dom";

function Syllabus() {
  // const [subjects, setSubjects] = useState<Subject[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [searchField, setSearchField] = useState<string>("subjectCode");
  const [dataFetched, setDataFetched] = useState<boolean>(false);
  const headerBg = "#f0f5ff";
  const headerColor = "#1d39c4";

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const data = await getSubject();

      if (!searchText.trim()) {
        setFilteredSubjects(data);
      } else {
        const filtered = data.filter((subject: Subject) =>
          subject[searchField as keyof Subject]
            ?.toString()
            .toLowerCase()
            .includes(searchText.toLowerCase()),
        );
        setFilteredSubjects(filtered);
      }
      setDataFetched(true);
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleFieldChange = (value: string) => {
    setSearchField(value);
    setSearchText("");
  };

  const columns: ColumnsType<Subject> = [
    {
      title: "Subject Code",
      dataIndex: "subjectCode",
      key: "subjectCode",
      width: "15%",
      onHeaderCell: () => ({
        style: {
          backgroundColor: headerBg,
          color: headerColor,
          fontWeight: "bold",
        },
      }),
    },
    {
      title: "Subject Name",
      dataIndex: "subjectName",
      key: "subjectName",
      width: "25%",
      onHeaderCell: () => ({
        style: {
          backgroundColor: headerBg,
          color: headerColor,
          fontWeight: "bold",
        },
      }),
    },
    {
      title: "Topic",
      dataIndex: "topic",
      key: "topic",
      width: "40%",
      onHeaderCell: () => ({
        style: {
          backgroundColor: headerBg,
          color: headerColor,
          fontWeight: "bold",
        },
      }),
      render: (text: string, record: Subject) => {
        try {
          const parsedTopic = JSON.parse(text);
          return (
            <Link
              to={`/syllabus/${record.id}`}
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              <div className="line-clamp-2">{parsedTopic.split("\n")[0]}</div>
            </Link>
          );
        } catch (e) {
          return (
            <Link
              to={`/syllabus/${record.id}`}
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              <div className="line-clamp-2">{text}</div>
            </Link>
          );
        }
      },
    },
    {
      title: "Created Date",
      dataIndex: "insDate",
      key: "insDate",
      width: "20%",
      onHeaderCell: () => ({
        style: {
          backgroundColor: headerBg,
          color: headerColor,
          fontWeight: "bold",
        },
      }),
      render: (date: Date) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <div className="h-full flex flex-col px-10 py-5">
      <div className="text-2xl font-semibold text-center text-[#2A384D] h-12 mb-6">
        Syllabus Management
      </div>
      <div className="flex-1 bg-white  rounded-md p-5">
        <div className="mb-4 flex gap-4">
          <Select
            defaultValue="subjectCode"
            style={{ width: 150 }}
            onChange={handleFieldChange}
            options={[
              { value: "subjectCode", label: "Search by Code" },
              { value: "subjectName", label: "Search by Name" },
            ]}
            className="rounded-none"
          />
          <Input
            placeholder={`Search by ${
              searchField === "subjectCode" ? "Code" : "Name"
            }`}
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 300 }}
            className="rounded-none"
          />
          <Button
            type="primary"
            onClick={fetchSubjects}
            className="bg-blue-500 rounded-none"
          >
            Search
          </Button>
        </div>

        {dataFetched && (
          <Table
            columns={columns}
            dataSource={filteredSubjects}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        )}
      </div>
    </div>
  );
}

export default Syllabus;
