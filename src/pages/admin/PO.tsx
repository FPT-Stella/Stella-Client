import React from "react";
import { useEffect, useState } from "react";
import { Table, Input, Button, Modal, Dropdown, Form } from "antd";
import { MdOutlineMoreVert } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { IoAddCircleOutline } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import type { MenuProps } from "antd";
import { getAllPO, deletePO, addPO, updatePO } from "../../services/PO_PLO";
import { CreatePO, PO } from "../../models/PO_PLO";
import { Program } from "../../models/Program";
import { getProgram } from "../../services/Program";
import "react-toastify/dist/ReactToastify.css";
import POForm from "../../components/Admin/POForm";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function ManagePO() {
  const [POS, setPOS] = useState<PO[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [filteredPOS, setFilteredPOS] = useState<PO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] =
    useState<boolean>(false);
  const [selecteditem, setSelecteditem] = useState<string | null>(null);
  const [editing, setEditing] = useState<PO | null>(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const headerBg = "#f0f5ff";
  const headerColor = "#1d39c4";
  const navigate = useNavigate();
  useEffect(() => {
    const fetchPO = async () => {
      try {
        const data = await getAllPO();
        setPOS(data);
        setFilteredPOS(data);
        const dataPro = await getProgram();
        setPrograms(dataPro);
      } catch (error) {
        console.error("Fail to fetching POS:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPO();
  }, []);

  const handleSearch = (value: string) => {
    setSearchText(value);
    const filteredData = POS.filter((po) =>
      po.poName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPOS(filteredData);
  };

  const handleAddPO = async (values: CreatePO) => {
    try {
      setLoading(true);
      const newPO = await addPO(values);
      setPOS((prev) => [...prev, newPO]);
      setFilteredPOS((prev) => [...prev, newPO]);
      toast.success("PO added successfully!");
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Failed to add PO:", error);
      toast.error("Failed to add PO.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditPO = async (values: {
    poName: string;
    description: string;
  }) => {
    if (!editing) return;
    try {
      setLoading(true);
      await updatePO(editing.id, values);
      const data = await getAllPO();
      setPOS(data);
      setFilteredPOS(data);
      toast.success("PO updated successfully!");
      setIsEditModalVisible(false);
      setEditing(null);
      editForm.resetFields();
    } catch (error) {
      console.error("Failed to update PO:", error);
      toast.error("Failed to update PO.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selecteditem) return;
    try {
      setLoading(true);
      await deletePO(selecteditem);
      const data = await getAllPO();
      setPOS(data);
      setFilteredPOS(data);

      toast.success("PO deleted successfully!");
      setIsDeleteModalVisible(false);
    } catch (error) {
      console.error("Failed to delete PO:", error);
      toast.error("Failed to delete PO.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (poId: string) => {
    navigate(`/ProgramOutcomes/DetailPO/${poId}`);
  };
  const showEditModal = (po: PO) => {
    setEditing(po);
    setIsEditModalVisible(true);
    editForm.setFieldsValue({
      poName: po.poName,
      description: po.description,
    });
  };

  const showDeleteModal = (id: string) => {
    setSelecteditem(id);
    setIsDeleteModalVisible(true);
  };

  const columns = [
    {
      title: "PO Name",
      dataIndex: "poName",
      key: "poName",
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
      title: "Program Code",
      dataIndex: "programId",
      key: "programId",
      width: 120,
      onHeaderCell: () => ({
        style: {
          backgroundColor: headerBg,
          color: headerColor,
          fontWeight: "bold",
        },
      }),
      render: (programId: string) => {
        const Program = programs.find((p) => p.id === programId);
        return Program ? Program.programCode : "Unknown";
      },
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
      render: (record: PO) => {
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
      <ToastContainer />
      <div className="text-lg font-semibold text-[#2A384D] h-8">
        Manage Program Outcomes
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
              <IoAddCircleOutline /> Add Program Learning Outcomes
            </Button>
          </div>
        </div>
        <Table
          size="small"
          dataSource={filteredPOS}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 8 }}
        />
      </div>
      <Modal
        width="40%"
        title="Add PO"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <POForm form={form} onFinish={handleAddPO} />
      </Modal>

      {/* Modal for Editing */}
      <Modal
        title="Edit PLO"
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditing(null);
          editForm.resetFields();
        }}
        footer={null}
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditPO}>
          <Form.Item
            label="PO Name"
            name="poName"
            rules={[
              { required: true, message: "Please enter the PO name!" },
              {
                pattern: /^PO.{1,}$/, // Bắt đầu bằng "PO" và ít nhất thêm 1 ký tự nữa
                message:
                  "PO name must start with 'PO' and be at least 3 characters.",
              },
            ]}
          >
            <Input placeholder="Enter PO name" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please enter the description!" },
            ]}
          >
            <Input.TextArea placeholder="Enter description" rows={5} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Update PO
            </Button>
          </Form.Item>
        </Form>
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
        <p>Are you sure you want to delete the PO?</p>
      </Modal>
    </div>
  );
}

export default ManagePO;
