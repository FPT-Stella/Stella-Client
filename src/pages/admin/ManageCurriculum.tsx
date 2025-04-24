import { useEffect, useState } from "react";
import { getCurriculum, deleteCurriculum } from "../../services/Curriculum";
import { Curriculum } from "../../models/Curriculum";
import { Table, Input, Button, Dropdown, Select, Modal } from "antd";
import type { MenuProps } from "antd";
import { IoAddCircleOutline } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { MdOutlineMoreVert } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { getProgram } from "../../services/Program";
import { Program } from "../../models/Program";
import { useNavigate } from "react-router-dom";
const { Option } = Select;

function ManageCurriculum() {
  const navigate = useNavigate();
  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
  const [program, setProgram] = useState<Program[]>([]);
  const [selectedCurrriculumId, setSelectedCurriculumId] = useState<
    string | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const [searchField, setSearchField] = useState<string>("curriculumCode");
  const [isDeleteModalVisible, setIsDeleteModalVisible] =
    useState<boolean>(false);
  const headerBg = "#f0f5ff";
  const headerColor = "#1d39c4";

  useEffect(() => {
    const fetchCurriculums = async () => {
      try {
        const data = await getCurriculum();
        setCurriculums(data);
        const dataProgram = await getProgram();
        setProgram(dataProgram);
      } catch (error) {
        console.error("Fail to fetching curriculum:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurriculums();
  }, []);
  const handleViewDetail = (curriculumId: string) => {
    navigate(`/manageCurriculum/${curriculumId}`);
  };
  const handleAddProgram = () => {
    navigate(`/manageCurriculum/AddCurriculum`);
  };
  const handleUpdateProgram = (curriculumId: string) => {
    navigate(`/manageCurriculum/UpdateCurriculum/${curriculumId}`);
  };
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
  const handleDelete = async () => {
    if (!selectedCurrriculumId) return;
    try {
      setLoading(true);
      await deleteCurriculum(selectedCurrriculumId);
      const data = await getCurriculum();
      setCurriculums(data);

      toast.success("Major deleted successfully!");
      setIsDeleteModalVisible(false);
    } catch (error) {
      console.error("Failed to delete major:", error);
      toast.error("Failed to delete major.");
    } finally {
      setLoading(false);
    }
  };
  const showDeleteModal = (id: string) => {
    setSelectedCurriculumId(id);

    setIsDeleteModalVisible(true);
  };
  const columns = [
    {
      title: "Code",
      dataIndex: "curriculumCode",
      key: "curriculumCode",
      width: 120,
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
      width: 180,
      onHeaderCell: () => ({
        style: {
          backgroundColor: headerBg,
          color: headerColor,
          fontWeight: "bold",
        },
      }),
    },
    {
      title: "Program",
      dataIndex: "programId",
      key: "programId",
      render: (programId: string) => {
        const Program = program.find((p) => p.id === programId);
        return Program ? Program.programCode : "Unknown";
      },
      width: 120,
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
      width: 100,
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
      width: 80,
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
      width: 80,
      onHeaderCell: () => ({
        style: {
          backgroundColor: headerBg,
          color: headerColor,
          fontWeight: "bold",
        },
      }),
    },
    {
      title: "Action",
      key: "action",
      render: (record: Curriculum) => {
        const items: MenuProps["items"] = [
          {
            key: "detail",
            label: (
              <Button
                className="border-none w-full text-green-700"
                onClick={() => handleViewDetail(record.id)}
              >
                <MdOutlineRemoveRedEye /> View Detail
              </Button>
            ),
          },
          {
            key: "edit",
            label: (
              <Button
                className="border-none w-full text-blue-700 flex justify-start"
                onClick={() => handleUpdateProgram(record.id)}
              >
                <FiEdit /> Edit
              </Button>
            ),
          },
          {
            key: "delete",
            label: (
              <Button
                className="border-none w-full text-red-600 flex justify-start"
                onClick={() => showDeleteModal(record.id)}
              >
                <RiDeleteBin7Fill /> Delete
              </Button>
            ),
          },
        ];
        return (
          <Dropdown menu={{ items }} trigger={["click"]}>
            <Button type="text" icon={<MdOutlineMoreVert size={25} />} />
          </Dropdown>
        );
      },
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
      <ToastContainer />
      <div className="text-lg font-semibold text-[#2A384D] h-8">
        Curriculum Management
      </div>

      <div className="flex-1 bg-white shadow-md rounded-md p-5">
        {/* Search and Dropdown */}
        <div className="flex items-center gap-4 mb-4 justify-between">
          <div className="flex gap-4">
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
          <div>
            <Button
              className="bg-[#635BFF] text-white font-medium"
              onClick={handleAddProgram}
            >
              <IoAddCircleOutline /> Add Curriculum
            </Button>
          </div>
        </div>

        {/* Table */}
        <Table
          size="small"
          dataSource={filteredData}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 6 }}
          loading={loading}
          onHeaderRow={() => ({
            style: {
              backgroundColor: "#f0f5ff",
              color: "#1d39c4",
              fontWeight: "bold",
            },
          })}
        />
      </div>
      <Modal
        title="Confirm Delete"
        open={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        onOk={handleDelete}
        okText="Delete"
        okType="danger"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete the Program?</p>
      </Modal>
    </div>
  );
}

export default ManageCurriculum;
