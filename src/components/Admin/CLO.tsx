import { useEffect, useState } from "react";
import { Table, Input, Button, Modal, Dropdown, Form } from "antd";
import { MdOutlineMoreVert } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { IoAddCircleOutline } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import type { MenuProps } from "antd";
import { useParams } from "react-router-dom";

import { getCLOBySubjectId, addCLO } from "../../services/CLO";
import { CLO, CreateCLO } from "../../models/CLO";
import "react-toastify/dist/ReactToastify.css";
import CLOForm from "./CLOForm";

function ManageCLO() {
  const { subjectId } = useParams<{ subjectId: string }>();

  const [CLOS, setCLOS] = useState<CLO[]>([]);
  const [filtered, setFiltered] = useState<CLO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  //   const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  //   const [isDeleteModalVisible, setIsDeleteModalVisible] =
  //     useState<boolean>(false);
  //   const [selecteditem, setSelecteditem] = useState<string | null>(null);
  //   const [editing, setEditing] = useState<CLO | null>(null);
  const [form] = Form.useForm();
  //   const [editForm] = Form.useForm();
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
      clo.details.toLowerCase().includes(value.toLowerCase())
    );
    setFiltered(filteredData);
  };

  const handleAddCLO = async (values: CreateCLO) => {
    try {
      setLoading(true);
      const newCLO = await addCLO(values);

      setCLOS((prev) => [...prev, newCLO]);
      setFiltered((prev) => [...prev, newCLO]);
      toast.success("PO added successfully!");
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

  //   const handleEditPO = async (values: {
  //     poName: string;
  //     description: string;
  //   }) => {
  //     if (!editing) return;
  //     try {
  //       setLoading(true);
  //       await updatePO(editing.id, values);
  //       const data = await getPOByProgramId(programId!);
  //       setPOS(data);
  //       setFilteredPOS(data);
  //       toast.success("PO updated successfully!");
  //       setIsEditModalVisible(false);
  //       setEditing(null);
  //       editForm.resetFields();
  //     } catch (error) {
  //       console.error("Failed to update PO:", error);
  //       toast.error("Failed to update PO.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   const handleDelete = async () => {
  //     if (!selecteditem) return;
  //     try {
  //       setLoading(true);
  //       await delete(selecteditem);
  //       const data = await getPOByProgramId(programId!);
  //       setPOS(data);
  //       setFilteredPOS(data);

  //       toast.success("PO deleted successfully!");
  //       setIsDeleteModalVisible(false);
  //     } catch (error) {
  //       console.error("Failed to delete PO:", error);
  //       toast.error("Failed to delete PO.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   const showEditModal = (po: PO) => {
  //     setEditing(po);
  //     setIsEditModalVisible(true);
  //     editForm.setFieldsValue({
  //       poName: po.poName,
  //       description: po.description,
  //     });
  //   };

  //   const showDeleteModal = (id: string) => {
  //     setSelecteditem(id);
  //     setIsDeleteModalVisible(true);
  //   };

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
      title: "Description",
      dataIndex: "details",
      key: "details",
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
      render: () => {
        const items: MenuProps["items"] = [
          {
            key: "edit",
            label: (
              <Button
                className="border-none w-full text-blue-700 flex justify-start"
                // onClick={() => showEditModal(record)}
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
                // onClick={() => showDeleteModal(record.id)}
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
    <div className="h-full flex flex-col py-10">
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
      {/* <Modal
        title="Edit PLO"
        width="50%"
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
                pattern: /^PO.{1,}$/,
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
      </Modal> */}
      {/* <Modal
        title="Confirm Delete"
        open={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        onOk={handleDelete}
        okText="Delete"
        okType="danger"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete the PO?</p>
      </Modal> */}
    </div>
  );
}

export default ManageCLO;
