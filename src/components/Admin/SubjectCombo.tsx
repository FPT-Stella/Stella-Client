import React from "react";
import { useEffect, useState } from "react";
import { Table, Input, Button, Modal, Dropdown, Form } from "antd";
import { MdOutlineMoreVert } from "react-icons/md";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { IoAddCircleOutline } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import type { MenuProps } from "antd";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import {
  getComboSubjectByProgram,
  deleteComboSubject,
  addComboSubject,
} from "../../services/Subject";
import ComboSubjectForm from "../../components/Admin/ComboSubjectForm";
import { CreateComboSubject, ComboSubject } from "../../models/Subject";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";

function SubjectCombo() {
  const { programId } = useParams<{ programId: string }>();
  const [subjects, setSubjects] = useState<ComboSubject[]>([]);
  const navigate = useNavigate();
  const [filteredSubject, setFilteredSubject] = useState<ComboSubject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] =
    useState<boolean>(false);
  const [selecteditem, setSelecteditem] = useState<string | null>(null);
  const [form] = Form.useForm();

  const headerBg = "#f0f5ff";
  const headerColor = "#1d39c4";

  useEffect(() => {
    const fetchCombo = async () => {
      try {
        const data = await getComboSubjectByProgram(programId!);
        setSubjects(data);

        setFilteredSubject(data);
      } catch (error) {
        console.error("Fail to fetching POLS:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCombo();
  }, [programId]);

  const handleSearch = (value: string) => {
    setSearchText(value);
    const filteredData = subjects.filter((cb) =>
      cb.comboName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSubject(filteredData);
  };
  const handleViewDetail = (
    programId: string | undefined,
    combosubjectId: string | undefined
  ) => {
    if (programId && combosubjectId) {
      navigate(`/manageProgram/${programId}/combo/${combosubjectId}`);
    } else {
      console.error("Program ID or Combo Subject ID is undefined");
    }
  };

  const handleAdd = async (values: CreateComboSubject) => {
    try {
      setLoading(true);
      const newCombo = await addComboSubject(values);
      const newId = newCombo.id;
      setSubjects((prev) => [...prev, newCombo]);
      setFilteredSubject((prev) => [...prev, newCombo]);
      setIsModalVisible(false);
      form.resetFields();
      toast.success("Combo Name added successfully!", {
        autoClose: 1500,
      });

      setTimeout(() => {
        navigate(`/manageProgram/${programId}/combo/${newId}`);
      }, 2000);
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

  const handleDelete = async () => {
    if (!selecteditem) return;
    try {
      setLoading(true);
      await deleteComboSubject(selecteditem);
      const data = await getComboSubjectByProgram(programId!);
      setSubjects(data);
      setFilteredSubject(data);

      toast.success("Combo Subject deleted successfully!");
      setIsDeleteModalVisible(false);
    } catch (error) {
      console.error("Failed to delete Combo Subject:", error);
      toast.error("Failed to delete Combo Subject.");
    } finally {
      setLoading(false);
    }
  };

  const showDeleteModal = (id: string) => {
    setSelecteditem(id);
    setIsDeleteModalVisible(true);
  };

  const columns = [
    {
      title: "Combo Name",
      dataIndex: "comboName",
      key: "comboName",
      width: 200,
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
      title: "Program Outcome",
      dataIndex: "programOutcome",
      render: (text: string) => <div className="line-clamp-3">{text}</div>,
      key: "programOutcome",
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
      width: 80,
      render: (record: ComboSubject) => {
        const items: MenuProps["items"] = [
          {
            key: "detail",
            label: (
              <Button
                className="border-none w-full text-green-700"
                onClick={() => handleViewDetail(programId, record.id)}
              >
                <MdOutlineRemoveRedEye /> View Detail
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
    <div className="h-full flex flex-col  py-16">
      <ToastContainer />
      <div className="text-lg font-semibold text-[#2A384D] h-8">
        Manage Subject Combo
      </div>
      {/* Table */}

      <div className="mb-4 flex justify-between">
        <Input
          placeholder="Search by Name"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 300 }}
        />
        <div>
          <Button
            className="bg-[#635BFF] text-white font-medium"
            onClick={() => setIsModalVisible(true)}
          >
            <IoAddCircleOutline /> Add Subject Combo
          </Button>
        </div>
      </div>
      <Table
        size="small"
        dataSource={filteredSubject}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Add Combo Subject"
        width="60%"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <ComboSubjectForm form={form} onFinish={handleAdd} />
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
        <p>Are you sure you want to delete the ComboSubject?</p>
      </Modal>
    </div>
  );
}

export default SubjectCombo;
