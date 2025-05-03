import { getTool, deleteTool, addTool } from "../../services/Tool";
import { Tool, CreateTool } from "../../models/Tool";
import { useEffect, useState } from "react";
import { MdOutlineMoreVert } from "react-icons/md";
import { RiDeleteBin7Fill } from "react-icons/ri";
import type { MenuProps } from "antd";
import { Table, Input, Button, Modal, Dropdown, Form } from "antd";

import { IoAddCircleOutline } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { MdOutlineRemoveRedEye } from "react-icons/md";

import "react-toastify/dist/ReactToastify.css";
function ManageTool() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [tool, setTool] = useState<Tool[]>([]);
  const [filtered, setFiltered] = useState<Tool[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] =
    useState<boolean>(false);
  const [form] = Form.useForm();

  const headerBg = "#f0f5ff";
  const headerColor = "#1d39c4";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTool();
        setTool(data);
        setFiltered(data);
      } catch (error) {
        console.error("Fail to fetching tool:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (value: string) => {
    setSearchText(value);
    let filteredData = tool;

    filteredData = filteredData.filter((tl) =>
      tl.toolName.toLowerCase().includes(value.toLowerCase())
    );

    setFiltered(filteredData);
  };
  const handleViewDetail = (toolId: string) => {
    navigate(`/manageTool/${toolId}`);
  };
  const handleAdd = async (values: CreateTool) => {
    try {
      const newtool = {
        ...values,
        description: JSON.stringify(values.description),
      };
      setLoading(true);

      // Gửi newtool chứ không phải values
      const newTool = await addTool(newtool);

      setTool((prev) => [...prev, newTool]);
      setFiltered((prev) => [...prev, newTool]);
      toast.success("Tool added successfully!");
      setIsModalVisible(false);
      form.resetFields();

      if (newTool && newTool.id) {
        navigate(`/manageTool/${newTool.id}`);
      }
    } catch (error) {
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
    if (!selectedId) return;
    try {
      setLoading(true);
      await deleteTool(selectedId);
      const data = await getTool();
      setTool(data);
      setFiltered(data);

      toast.success("Tool deleted successfully!");
      setIsDeleteModalVisible(false);
    } catch (error) {
      console.error("Failed to delete Tool:", error);
      toast.error("Failed to delete Tool.");
    } finally {
      setLoading(false);
    }
  };
  const showDeleteModal = (id: string) => {
    setSelectedId(id);

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
      title: "Tool Name",
      dataIndex: "toolName",
      width: 280,
      key: "toolName",
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
      render: (text: string) => (
        <div className="line-clamp-3">
          {text?.replace(/^"|"$/g, "").replace(/\n/g, "").trim()}
        </div>
      ),
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
      render: (record: Tool) => {
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
      <div className="text-lg font-semibold text-[#2A384D] h-8">
        Tool Manage
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
          </div>

          <div>
            <Button
              className="bg-[#635BFF] text-white font-medium"
              onClick={() => setIsModalVisible(true)}
            >
              <IoAddCircleOutline /> Add Tool
            </Button>
          </div>
        </div>
        <Table
          size="small"
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 8 }}
        />
      </div>
      <Modal
        title="Add Tool"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={"60%"}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <Form.Item
            label="Tool Name"
            name="toolName"
            rules={[{ required: true, message: "Please enter the Tool name!" }]}
          >
            <Input placeholder="Enter Tool name" />
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
        <p>Are you sure you want to delete the Tool?</p>
      </Modal>
    </div>
  );
}

export default ManageTool;
