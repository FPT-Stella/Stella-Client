import { useEffect, useState } from "react";
import { Table, Input, Button, Modal, Dropdown, Form } from "antd";
import { MdOutlineMoreVert } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { IoAddCircleOutline } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import type { MenuProps } from "antd";
import { useParams } from "react-router-dom";

import {
  getCLOBySubjectId,
  addCLO,
  deleteCLO,
  updateCLO,
} from "../../services/CLO";
import { CLO, CreateCLO } from "../../models/CLO";
import "react-toastify/dist/ReactToastify.css";
import CLOForm from "./CLOForm";
import CLOMappingList from "./CLO_PLO";
function ManageCLO() {
  const { subjectId } = useParams<{ subjectId: string }>();

  const [CLOS, setCLOS] = useState<CLO[]>([]);
  const [filtered, setFiltered] = useState<CLO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] =
    useState<boolean>(false);
  const [selecteditem, setSelecteditem] = useState<string | null>(null);
  const [editing, setEditing] = useState<CLO | null>(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const headerBg = "#f0f5ff";
  const headerColor = "#1d39c4";

  useEffect(() => {
    const fetchCLO = async () => {
      try {
        const data = await getCLOBySubjectId(subjectId!);
        setCLOS(data);
        setFiltered(data);
      } catch (error) {
        console.error("Fail to fetching POS:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCLO();
  }, [subjectId]);

  const handleSearch = (value: string) => {
    setSearchText(value);
    const filteredData = CLOS.filter((clo) =>
      clo.cloName.toLowerCase().includes(value.toLowerCase())
    );
    setFiltered(filteredData);
  };

  const handleAddCLO = async (values: CreateCLO) => {
    try {
      setLoading(true);
      const newCLO = await addCLO(values);

      setCLOS((prev) => [...prev, newCLO]);
      setFiltered((prev) => [...prev, newCLO]);
      toast.success("CLO added successfully!");
      setIsModalVisible(false);
      form.resetFields();
    } catch (error: unknown) {
      console.error("Failed to add program:", error);
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "details" in error.response.data &&
        typeof error.response.data.details === "string"
      ) {
        toast.error(error.response.data.details);
      } else {
        toast.error("Failed to add program.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditCLO = async (values: CreateCLO) => {
    if (!editing) return;
    try {
      setLoading(true);
      await updateCLO(editing.id, values);
      const data = await getCLOBySubjectId(subjectId!);
      setCLOS(data);
      setFiltered(data);
      toast.success("CLO updated successfully!");
      setIsEditModalVisible(false);
      setEditing(null);
      editForm.resetFields();
    } catch (error) {
      console.error("Failed to update CLO:", error);
      toast.error("Failed to update CLO.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selecteditem) return;
    try {
      setLoading(true);
      await deleteCLO(selecteditem);
      const data = await getCLOBySubjectId(subjectId!);
      setCLOS(data);
      setFiltered(data);

      toast.success("CLO deleted successfully!");
      setIsDeleteModalVisible(false);
    } catch (error) {
      console.error("Failed to delete CLO:", error);
      toast.error("Failed to delete CLO.");
    } finally {
      setLoading(false);
    }
  };

  const showEditModal = (clo: CLO) => {
    setEditing(clo);
    setIsEditModalVisible(true);
    editForm.setFieldsValue({
      cloName: clo.cloName,
      cloDetails: clo.cloDetails,
      loDetails: clo.loDetails,
      subjectId: clo.subjectId,
    });
  };

  const showDeleteModal = (id: string) => {
    setSelecteditem(id);
    setIsDeleteModalVisible(true);
  };

  const columns = [
    // {
    //   title: "ID",
    //   dataIndex: "id",
    //   key: "id",

    //   onHeaderCell: () => ({
    //     style: {
    //       backgroundColor: headerBg,
    //       color: headerColor,
    //       fontWeight: "bold",
    //     },
    //   }),
    // },
    {
      title: "CLO Name",
      dataIndex: "cloName",
      key: "cloName",
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
      dataIndex: "cloDetails",
      key: "cloDetails",
      onHeaderCell: () => ({
        style: {
          backgroundColor: headerBg,
          color: headerColor,
          fontWeight: "bold",
        },
      }),
    },
    {
      title: "PLO",
      key: "plo",
      width: 300,
      render: (record: CLO) => {
        return <CLOMappingList cloId={record.id} />;
      },
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
      width: 90,
      render: (record: CLO) => {
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
    <div className="h-full flex flex-col py-5">
      <ToastContainer />
      <div className="text-lg font-semibold text-[#2A384D] h-8">
        Manage Course Learning Outcomes
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
            <IoAddCircleOutline /> Add Course Learning Outcomesss
          </Button>
        </div>
      </div>
      <Table
        size="small"
        dataSource={filtered}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        width="50%"
        title="Add PO"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <CLOForm form={form} onFinish={handleAddCLO} />
      </Modal>

      {/* Modal for Editing */}
      <Modal
        title="Edit CLO"
        width="50%"
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditing(null);
          editForm.resetFields();
        }}
        footer={null}
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditCLO}>
          <Form.Item
            label="CLO Name"
            name="cloName"
            rules={[
              { required: true, message: "Please enter the CLO name!" },
              {
                // pattern: /^PO.{1,}$/,
                pattern: /^CLO\d+$/,

                message:
                  "CLO name must start with 'CLO'+ number and be at least 4 characters.",
              },
            ]}
          >
            <Input placeholder="Enter PO name" />
          </Form.Item>

          <Form.Item hidden name="subjectId">
            <Input hidden />
          </Form.Item>

          <Form.Item
            label="Description"
            name="cloDetails"
            rules={[
              { required: true, message: "Please enter the description!" },
            ]}
          >
            <Input.TextArea placeholder="Enter description" rows={6} />
          </Form.Item>

          <Form.Item hidden name="loDetails">
            <Input hidden />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Update
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
        <p>Are you sure you want to delete the CLO?</p>
      </Modal>
    </div>
  );
}

export default ManageCLO;
