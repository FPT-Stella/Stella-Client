import { Major } from "../../models/Major";
import { getMajor, addMajor } from "../../services/Major";
import { useEffect, useState } from "react";
import { Table, Input, Button, Modal, Form, Dropdown, Menu } from "antd";
import { MdOutlineMoreVert } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { IoAddCircleOutline } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function ManageMajor() {
  const [majors, setMajors] = useState<Major[]>([]);
  const [filteredMajors, setFilteredMajors] = useState<Major[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();

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
      toast.success("Major added successfully!"); // Hiển thị thông báo thành công
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Failed to add major:", error);
      toast.error("Failed to add major."); // Hiển thị thông báo lỗi
    } finally {
      setLoading(false);
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
      render: () => {
        const menu = (
          <Menu>
            <Menu.Item key="edit">
              <Button className="border-none w-full text-blue-700 flex justify-start">
                <FiEdit /> Edit
              </Button>
            </Menu.Item>
            <Menu.Item key="delete">
              <Button className="border-none w-full text-red-600 ">
                <RiDeleteBin7Fill /> Delete
              </Button>
            </Menu.Item>
          </Menu>
        );

        return (
          <Dropdown overlay={menu} trigger={["click"]}>
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
          dataSource={filteredMajors}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </div>

      {/* Modal for Adding Major */}
      <Modal
        title="Add Major"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddMajor}>
          <Form.Item
            label="Major Name"
            name="majorName"
            rules={[
              { required: true, message: "Please enter the major name!" },
            ]}
          >
            <Input placeholder="Enter major name" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please enter the description!" },
            ]}
          >
            <Input.TextArea placeholder="Enter description" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Add Major
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ManageMajor;
