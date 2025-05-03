import {
  getProgram,
  deleteProgram,
  addProgram,
  updateProgram,
} from "../../services/Program";
import { AddProgram, Program } from "../../models/Program";
import { useEffect, useState } from "react";
import { MdOutlineMoreVert } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin7Fill } from "react-icons/ri";
import type { MenuProps } from "antd";
import { Table, Input, Button, Modal, Dropdown, Form, Select } from "antd";
import ProgramForm from "../../components/Admin/ProgramForm";
import EditProgram from "../../components/Admin/EditProgram";
import { Major } from "../../models/Major";
import { getMajor } from "../../services/Major";
import { IoAddCircleOutline } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { MdOutlineRemoveRedEye } from "react-icons/md";

import "react-toastify/dist/ReactToastify.css";
function ManageProgram() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [program, setProgram] = useState<Program[]>([]);
  const [filteredProgram, setFilteredProgram] = useState<Program[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(
    null
  );
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const [selectedMajor, setSelectedMajor] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isEditModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] =
    useState<boolean>(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const headerBg = "#f0f5ff";
  const headerColor = "#1d39c4";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataMajor = await getMajor();
        setMajors(dataMajor);
        const data = await getProgram();
        setProgram(data);
        setFilteredProgram(data);
      } catch (error) {
        console.error("Fail to fetching curriculum:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (value: string) => {
    setSearchText(value);
    let filteredData = program;

    if (selectedMajor && selectedMajor !== "all") {
      filteredData = filteredData.filter((p) => p.majorId === selectedMajor);
    }

    filteredData = filteredData.filter((program) =>
      program.programCode.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredProgram(filteredData);
  };
  const handleViewDetail = (programId: string) => {
    navigate(`/manageProgram/${programId}`);
  };
  const handleAddProgram = async (values: AddProgram) => {
    try {
      setLoading(true);
      const newMajor = await addProgram(values);
      setProgram((prev) => [...prev, newMajor]);
      setFilteredProgram((prev) => [...prev, newMajor]);
      toast.success("Program added successfully!");
      setIsModalVisible(false);
      form.resetFields();

      if (newMajor && newMajor.id) {
        navigate(`/manageProgram/${newMajor.id}`);
      }
    } catch (error) {
      // Sử dụng AxiosError để xác định kiểu lỗi
      if (error instanceof AxiosError) {
        console.error("Failed to add:", error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast.error(error.response.data.details);
        } else {
          toast.error("Failed to add.");
        }
      } else {
        console.error("Unexpected error:", error);
        toast.error("Failed to add.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditProgram = async (values: Partial<Program>) => {
    if (!selectedProgram) return;
    try {
      setLoading(true);
      await updateProgram(selectedProgram.id, values);
      const data = await getProgram();
      setProgram(data);
      setFilteredProgram(data);
      toast.success("Program updated successfully!");
      setEditModalVisible(false);
      setSelectedProgram(null);
      editForm.resetFields();
    } catch (error) {
      console.error("Failed to update program:", error);
      toast.error("Failed to update program.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProgramId) return;
    try {
      setLoading(true);
      await deleteProgram(selectedProgramId);
      const data = await getProgram();
      setProgram(data);
      setFilteredProgram(data);

      toast.success("Program deleted successfully!");
      setIsDeleteModalVisible(false);
    } catch (error) {
      console.error("Failed to delete Program:", error);
      toast.error("Failed to delete Program.");
    } finally {
      setLoading(false);
    }
  };
  const showDeleteModal = (id: string) => {
    setSelectedProgramId(id);

    setIsDeleteModalVisible(true);
  };
  const showEditModal = (program: Program) => {
    setSelectedProgram(program);
    setEditModalVisible(true);
  };
  const handleFilterByMajor = (value: string) => {
    setSelectedMajor(value);
    if (value === "all") {
      setFilteredProgram(program);
    } else {
      const filteredData = program.filter((item) => item.majorId === value);
      setFilteredProgram(filteredData);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      onHeaderCell: () => ({
        style: {
          backgroundColor: headerBg,
          color: headerColor,
          fontWeight: "bold",
        },
      }),
    },
    {
      title: "Major",
      dataIndex: "majorId",
      key: "majorId",
      onHeaderCell: () => ({
        style: {
          backgroundColor: headerBg,
          color: headerColor,
          fontWeight: "bold",
        },
      }),
      render: (majorId: string) => {
        const major = majors.find((major) => major.id === majorId);
        return major ? major.majorName : "Unknown";
      },
    },
    {
      title: "Program Code",
      dataIndex: "programCode",
      key: "programCode",
      onHeaderCell: () => ({
        style: {
          backgroundColor: headerBg,
          color: headerColor,
          fontWeight: "bold",
        },
      }),
    },
    {
      title: "programName",
      dataIndex: "programName",
      key: "programName",
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
      render: (record: Program) => {
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
                onClick={() => showEditModal(record)}
              >
                <FiEdit /> Edit
              </Button>
            ),
          },
          {
            key: "delete",
            label: (
              <Button
                className="border-none w-full text-red-600"
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
      <div className="text-lg font-semibold text-[#2A384D] h-8">
        Manage Program
      </div>

      {/* Table */}
      <div className="flex-1 bg-white shadow-md rounded-md p-5">
        <ToastContainer />
        <div className="mb-4 flex justify-between">
          <div className="flex gap-4">
            <Input
              placeholder="Search by Name Code Program"
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 300 }}
            />
            <Select
              value={selectedMajor || "all"}
              onChange={handleFilterByMajor}
              style={{ width: 200 }}
            >
              <Select.Option value="all">Tất cả ngành học</Select.Option>
              {majors.map((major) => (
                <Select.Option key={major.id} value={major.id}>
                  {major.majorName}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div>
            <Button
              className="bg-[#635BFF] text-white font-medium"
              onClick={() => setIsModalVisible(true)}
            >
              <IoAddCircleOutline /> Add Program
            </Button>
          </div>
        </div>
        <Table
          size="small"
          dataSource={filteredProgram}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 8 }}
        />
      </div>
      {/* Modal for Adding Program */}
      <Modal
        title="Add Major"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <ProgramForm form={form} onFinish={handleAddProgram} />
      </Modal>
      <Modal
        title="Edit Major"
        open={isEditModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setSelectedProgram(null);
        }}
        footer={null}
      >
        <EditProgram
          form={editForm}
          onFinish={handleEditProgram}
          initialValues={selectedProgram!}
        />
      </Modal>
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

export default ManageProgram;
