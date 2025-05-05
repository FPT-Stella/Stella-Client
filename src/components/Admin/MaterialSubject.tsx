import { useEffect, useState } from "react";
import { Table, Input, Button, Modal, Dropdown, Form } from "antd";
import { MdOutlineMoreVert } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { IoAddCircleOutline } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import type { MenuProps } from "antd";
import { useParams } from "react-router-dom";
import { FiLink } from "react-icons/fi";
import {
  getMaterialBySubjectId,
  deleteMaterial,
  updateMaterial,
  addMaterial,
} from "../../services/Material";
import {
  Material,
  CreateMaterial,
  UpdateMaterial,
} from "../../models/Material";
import "react-toastify/dist/ReactToastify.css";

function MaterialSubject() {
  const { subjectId } = useParams<{ subjectId: string }>();

  const [material, setMaterial] = useState<Material[]>([]);
  const [filtered, setFiltered] = useState<Material[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] =
    useState<boolean>(false);
  const [selecteditem, setSelecteditem] = useState<string | null>(null);
  const [editing, setEditing] = useState<Material | null>(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const headerBg = "#f0f5ff";
  const headerColor = "#1d39c4";

  useEffect(() => {
    const fetchPO = async () => {
      try {
        const data = await getMaterialBySubjectId(subjectId!);
        setMaterial(data);
        setFiltered(data);
      } catch (error) {
        console.error("Fail to fetching material:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPO();
  }, [subjectId]);

  const handleSearch = (value: string) => {
    setSearchText(value);
    const filteredData = material.filter((m) =>
      m.materialName.toLowerCase().includes(value.toLowerCase())
    );
    setFiltered(filteredData);
  };

  const handleAdd = async (values: CreateMaterial) => {
    try {
      setLoading(true);
      const newMaterial = await addMaterial(values);

      setMaterial((prev) => [...prev, newMaterial]);
      setFiltered((prev) => [...prev, newMaterial]);
      toast.success("Material added successfully!");
      setIsModalVisible(false);
      form.resetFields();
    } catch (error: unknown) {
      console.error("Failed to add material:", error);
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
        toast.error("Failed to add material.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (values: UpdateMaterial) => {
    if (!editing) return;
    try {
      setLoading(true);
      await updateMaterial(editing.id, values);
      const data = await getMaterialBySubjectId(subjectId!);
      setMaterial(data);
      setFiltered(data);
      toast.success("Material updated successfully!");
      setIsEditModalVisible(false);
      setEditing(null);
      editForm.resetFields();
    } catch (error) {
      console.error("Failed to update Material:", error);
      toast.error("Failed to update Material.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selecteditem) return;
    try {
      setLoading(true);
      await deleteMaterial(selecteditem);
      const data = await getMaterialBySubjectId(subjectId!);
      setMaterial(data);
      setFiltered(data);

      toast.success("Material deleted successfully!");
      setIsDeleteModalVisible(false);
    } catch (error) {
      console.error("Failed to delete Material:", error);
      toast.error("Failed to delete Material.");
    } finally {
      setLoading(false);
    }
  };

  const showEditModal = (m: Material) => {
    setEditing(m);
    setIsEditModalVisible(true);
    editForm.setFieldsValue({
      materialName: m.materialName,
      description: m.description,
      materialType: m.materialType,
      materialUrl: m.materialUrl,
    });
  };

  const showDeleteModal = (id: string) => {
    setSelecteditem(id);
    setIsDeleteModalVisible(true);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "materialName",
      key: "materialName",
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
      onHeaderCell: () => ({
        style: {
          backgroundColor: headerBg,
          color: headerColor,
          fontWeight: "bold",
        },
      }),
    },
    {
      title: "Type",
      dataIndex: "materialType",
      key: "materialType",
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
      title: "Link",
      dataIndex: "materialUrl",
      key: "materialUrl",
      width: 80,
      onHeaderCell: () => ({
        style: {
          backgroundColor: headerBg,
          color: headerColor,
          fontWeight: "bold",
        },
      }),
      render: (url: string) =>
        url ? (
          <a href={url} target="_blank" rel="noopener noreferrer">
            <FiLink className="text-blue-500 hover:text-blue-700 cursor-pointer text-xl" />
          </a>
        ) : (
          "-"
        ),
    },
    {
      title: "Action",
      key: "action",
      width: 80,
      render: (record: Material) => {
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
        Manage Program Outcomes
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
            <IoAddCircleOutline /> Add Material
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
        width="55%"
        title="Add Materialss"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <Form.Item name="subjectId" initialValue={subjectId} hidden>
            <Input />
          </Form.Item>

          <Form.Item
            label="Material Name"
            name="materialName"
            rules={[{ required: true, message: "Please enter the name!" }]}
          >
            <Input placeholder="Enter Material name" />
          </Form.Item>
          <Form.Item
            label="Material Type"
            name="materialType"
            rules={[
              { required: true, message: "Please enter the material type!" },
            ]}
          >
            <Input placeholder="Enter Material Link" />
          </Form.Item>
          <Form.Item
            label="Material Url"
            name="materialUrl"
            rules={[
              { required: true, message: "Please enter the materialUrl!" },
              {
                type: "url",
                message: "Please enter url ( https:// or http://)",
              },
            ]}
          >
            <Input placeholder="Enter materialUrl" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please enter the description!" },
            ]}
          >
            <Input.TextArea placeholder="Enter description" rows={12} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for Editing */}
      <Modal
        title="Edit "
        width="55%"
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditing(null);
          editForm.resetFields();
        }}
        footer={null}
      >
        <Form form={editForm} layout="vertical" onFinish={handleEdit}>
          <Form.Item
            label="Material Name"
            name="materialName"
            rules={[{ required: true, message: "Please enter the name!" }]}
          >
            <Input placeholder="Enter Material name" />
          </Form.Item>
          <Form.Item
            label="Material Type"
            name="materialType"
            rules={[
              { required: true, message: "Please enter the material type!" },
            ]}
          >
            <Input placeholder="Enter Material Link" />
          </Form.Item>
          <Form.Item
            label="Material Url"
            name="materialUrl"
            rules={[
              { required: true, message: "Please enter the materialUrl!" },
              {
                type: "url",
                message: "Please enter url ( https:// or http://)",
              },
            ]}
          >
            <Input placeholder="Enter materialUrl" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please enter the description!" },
            ]}
          >
            <Input.TextArea placeholder="Enter description" rows={12} />
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
        <p>Are you sure you want to delete the Material?</p>
      </Modal>
    </div>
  );
}

export default MaterialSubject;
