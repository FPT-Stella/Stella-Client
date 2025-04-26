import React from "react";
import { useEffect, useState } from "react";
import { Table, Input, Button, Modal, Dropdown, Form } from "antd";
import { MdOutlineMoreVert } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { IoAddCircleOutline } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import type { MenuProps } from "antd";
import { getAllPLO, deletePLO, addPLO, updatePLO } from "../../services/PO_PLO";
import { CreatePLO, PLO } from "../../models/PO_PLO";
import { Curriculum } from "../../models/Curriculum";
import { getCurriculum } from "../../services/Curriculum";
import "react-toastify/dist/ReactToastify.css";
import PLOForm from "../../components/Admin/PLOForm";
function ManagePLO() {
  const [POLS, setPOLS] = useState<PLO[]>([]);
  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
  const [filteredPOLS, setFilteredPOLS] = useState<PLO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] =
    useState<boolean>(false);
  const [selecteditem, setSelecteditem] = useState<string | null>(null);
  const [editing, setEditing] = useState<PLO | null>(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const headerBg = "#f0f5ff";
  const headerColor = "#1d39c4";

  useEffect(() => {
    const fetchPLO = async () => {
      try {
        const data = await getAllPLO();
        setPOLS(data);
        setFilteredPOLS(data);
        const dataCurri = await getCurriculum();
        setCurriculums(dataCurri);
      } catch (error) {
        console.error("Fail to fetching POLS:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPLO();
  }, []);

  const handleSearch = (value: string) => {
    setSearchText(value);
    const filteredData = POLS.filter((plo) =>
      plo.ploName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPOLS(filteredData);
  };

  const handleAddPLO = async (values: CreatePLO) => {
    try {
      setLoading(true);
      const newPLO = await addPLO(values);
      setPOLS((prev) => [...prev, newPLO]);
      setFilteredPOLS((prev) => [...prev, newPLO]);
      toast.success("PLO added successfully!");
      setIsModalVisible(false);
      form.resetFields();
    } catch (error: any) {
      console.error("Failed to add program:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.details);
      } else {
        toast.error("Failed to add program.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditPLO = async (values: {
    ploName: string;
    description: string;
  }) => {
    if (!editing) return;
    try {
      setLoading(true);
      await updatePLO(editing.id, values);
      const data = await getAllPLO();
      setPOLS(data);
      setFilteredPOLS(data);
      toast.success("PLO updated successfully!");
      setIsEditModalVisible(false);
      setEditing(null);
      editForm.resetFields();
    } catch (error) {
      console.error("Failed to update PLO:", error);
      toast.error("Failed to update PLO.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selecteditem) return;
    try {
      setLoading(true);
      await deletePLO(selecteditem);
      const data = await getAllPLO();
      setPOLS(data);
      setFilteredPOLS(data);

      toast.success("PLO deleted successfully!");
      setIsDeleteModalVisible(false);
    } catch (error) {
      console.error("Failed to delete PLO:", error);
      toast.error("Failed to delete PLO.");
    } finally {
      setLoading(false);
    }
  };

  const showEditModal = (plo: PLO) => {
    setEditing(plo);
    setIsEditModalVisible(true);
    editForm.setFieldsValue({
      ploName: plo.ploName,
      description: plo.description,
    });
  };

  const showDeleteModal = (id: string) => {
    setSelecteditem(id);
    setIsDeleteModalVisible(true);
  };

  const columns = [
    {
      title: "PLO Name",
      dataIndex: "ploName",
      key: "ploName",
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
      title: "Curriculum",
      dataIndex: "curriculumId",
      key: "curriculumId",
      onHeaderCell: () => ({
        style: {
          backgroundColor: headerBg,
          color: headerColor,
          fontWeight: "bold",
        },
      }),
      render: (curriculumId: string) => {
        const Curriculum = curriculums.find((p) => p.id === curriculumId);
        return Curriculum ? Curriculum.curriculumCode : "Unknown";
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
      render: (record: PLO) => {
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
        Manage Program Learning Outcomes
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
          dataSource={filteredPOLS}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 8 }}
        />
      </div>
      <Modal
        title="Add PLO"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <PLOForm form={form} onFinish={handleAddPLO} />
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
        <Form form={editForm} layout="vertical" onFinish={handleEditPLO}>
          <Form.Item
            label="PLO Name"
            name="ploName"
            rules={[{ required: true, message: "Please enter the PLO name!" }]}
          >
            <Input placeholder="Enter PLO name" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please enter the description!" },
            ]}
          >
            <Input.TextArea placeholder="Enter description" rows={4} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Update PLO
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
        <p>Are you sure you want to delete the PLO?</p>
      </Modal>
    </div>
  );
}

export default ManagePLO;
