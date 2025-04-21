import { useEffect, useState } from "react";
import { getCurriculum } from "../../services/Curriculum";
import { Curriculum } from "../../models/Curriculum";
import { Table, Input, Select } from "antd";

const { Option } = Select;

function ManageCurriculum() {
  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const [searchField, setSearchField] = useState<string>("curriculumCode");
  const headerBg = "#f0f5ff";
  const headerColor = "#1d39c4";

  useEffect(() => {
    const fetchCurriculums = async () => {
      try {
        const data = await getCurriculum();
        setCurriculums(data);
      } catch (error) {
        console.error("Fail to fetching curriculum:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurriculums();
  }, []);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleFieldChange = (value: string) => {
    setSearchField(value);
    setSearchText("");
  };

  const filteredData = curriculums.filter((item) =>
    item[searchField as keyof Curriculum]
      ?.toString()
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

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

  return (
    <div className="h-full flex flex-col px-10 py-5">
      <div className="text-lg font-semibold text-[#2A384D] h-8">
        Curriculum Management
      </div>

      <div className="flex-1 bg-white shadow-md rounded-md p-5">
        {/* Search and Dropdown */}
        <div className="flex items-center gap-4 mb-4">
          <Select
            defaultValue="curriculumCode"
            style={{ width: 150 }}
            onChange={handleFieldChange}
          >
            <Option value="curriculumCode">Search by Code</Option>
            <Option value="curriculumName">Search by Name</Option>
          </Select>
          <Input
            placeholder={`Search ${
              searchField === "curriculumCode" ? "Code" : "Name"
            }`}
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 300 }}
          />
        </div>

        {/* Table */}
        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 3 }}
          loading={loading}
          onHeaderRow={() => ({
            style: {
              backgroundColor: "#f0f5ff", // Màu nền cho toàn bộ hàng tiêu đề
              color: "#1d39c4", // Màu chữ cho toàn bộ hàng tiêu đề
              fontWeight: "bold", // Chữ đậm
            },
          })}
        />
      </div>
    </div>
  );
}

export default ManageCurriculum;
