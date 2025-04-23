import { Major } from "../../models/Major";
import {
  getMajor,
  addMajor,
  updateMajor,
  deleteMajor,
} from "../../services/Major";
import { useEffect, useState } from "react";
import { Table, Input, Button, Modal, Dropdown, Form } from "antd";
import { MdOutlineMoreVert } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { IoAddCircleOutline } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import type { MenuProps } from "antd";
import "react-toastify/dist/ReactToastify.css";
import MajorForm from "../../components/Admin/MajorForm";

function ManageMajor() {
  const [majors, setMajors] = useState<Major[]>([]);
  const [filteredMajors, setFilteredMajors] = useState<Major[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] =
    useState<boolean>(false);
  const [selectedMajorId, setSelectedMajorId] = useState<string | null>(null);
  const [editingMajor, setEditingMajor] = useState<Major | null>(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const headerBg = "#f0f5ff";
  const headerColor = "#1d39c4";

  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const data = await getMajor();
        setMajors(data);
        setFilteredMajors(data);
      } catch (error) {
        console.error("Fail to fetching curriculum:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMajors();
  }, []);

  const handleSearch = (value: string) => {
    setSearchText(value);
    const filteredData = majors.filter((major) =>
      major.majorName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredMajors(filteredData);
  };

  const handleAddMajor = async (values: {
    majorName: string;
    description: string;
  }) => {
    try {
      setLoading(true);
      const newMajor = await addMajor(values);
      setMajors((prev) => [...prev, newMajor]);
      setFilteredMajors((prev) => [...prev, newMajor]);
      toast.success("Major added successfully!");
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Failed to add major:", error);
      toast.error("Failed to add major.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditMajor = async (values: {
    majorName: string;
    description: string;
  }) => {
    if (!editingMajor) return;
    try {
      setLoading(true);
      await updateMajor(editingMajor.id, values);
      const data = await getMajor();
      setMajors(data);
      setFilteredMajors(data);
      toast.success("Major updated successfully!");
      setIsEditModalVisible(false);
      setEditingMajor(null);
      editForm.resetFields();
    } catch (error) {
      console.error("Failed to update major:", error);
      toast.error("Failed to update major.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedMajorId) return;
    try {
      setLoading(true);
      await deleteMajor(selectedMajorId);
      const data = await getMajor();
      setMajors(data);
      setFilteredMajors(data);

      toast.success("Major deleted successfully!");
      setIsDeleteModalVisible(false);
    } catch (error) {
      console.error("Failed to delete major:", error);
      toast.error("Failed to delete major.");
    } finally {
      setLoading(false);
    }
  };

  const showEditModal = (major: Major) => {
    setEditingMajor(major);
    setIsEditModalVisible(true);
  };

  const showDeleteModal = (id: string) => {
    setSelectedMajorId(id);
    setIsDeleteModalVisible(true);
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
      title: "Name",
      dataIndex: "majorName",
      key: "majorName",
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
      render: (record: Major) => {
        const items: MenuProps["items"] = [
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
      <ToastContainer />
      <div className="text-lg font-semibold text-[#2A384D] h-8">
        Manage Major
      </div>

      {/* Table */}
      <div className="flex-1 bg-white shadow-md rounded-md p-5">
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
              <IoAddCircleOutline /> Add Major
            </Button>
          </div>
        </div>
        <Table
          size="small"
          dataSource={filteredMajors}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 8 }}
        />
      </div>

      {/* Modal for Adding Major */}
      <Modal
        title="Add Major"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <MajorForm form={form} onFinish={handleAddMajor} isEditMode={false} />
      </Modal>

      {/* Modal for Editing Major */}
      <Modal
        title="Edit Major"
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingMajor(null);
          editForm.resetFields();
        }}
        footer={null}
      >
        <MajorForm
          form={editForm}
          onFinish={handleEditMajor}
          isEditMode={true}
          initialValues={editingMajor || undefined}
        />
      </Modal>

      {/* Modal for Confirming Delete */}
      <Modal
        title="Confirm Delete"
        open={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        onOk={handleDelete}
        okText="Delete"
        okType="danger"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete the major?</p>
      </Modal>
    </div>
  );
}

export default ManageMajor;
