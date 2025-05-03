import { Major } from "../../models/Major";
import { getMajor } from "../../services/Major";
import { useEffect, useState } from "react";
import { Table, Input, Button, Dropdown, Select, Modal } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Student, User } from "../../models/User";
import { getAllStudents, getAllAccount } from "../../services/user";
import type { MenuProps } from "antd";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { MdOutlineMoreVert } from "react-icons/md";
import { deleteStudentById, deleteAccountById } from "../../services/user";
function ManageUser() {
  const [students, setStudents] = useState<Student[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [accounts, setAccounts] = useState<User[]>([]); // Add this state
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const [searchField, setSearchField] = useState<string>("studentCode");
  const [isDeleteModalVisible, setIsDeleteModalVisible] =
    useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const headerBg = "#f0f5ff";
  const headerColor = "#1d39c4";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsData = await getAllStudents();
        const majorsData = await getMajor();
        const accountsData = await getAllAccount();

        setStudents(studentsData);
        setMajors(majorsData);
        setAccounts(accountsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to load student data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleFieldChange = (value: string) => {
    setSearchField(value);
    setSearchText("");
  };
  const handleDelete = async () => {
    if (!selectedStudent) return;
    try {
      setLoading(true);
      await deleteStudentById(selectedStudent.id);
      await deleteAccountById(selectedStudent.userId);
      const data = await getAllStudents();
      setStudents(data);

      toast.success("Major deleted successfully!");
      setIsDeleteModalVisible(false);
    } catch (error) {
      console.error("Failed to delete major:", error);
      toast.error("Failed to delete major.");
    } finally {
      setLoading(false);
    }
  };
  const showDeleteModal = (value: Student) => {
    setSelectedStudent(value);

    setIsDeleteModalVisible(true);
  };

  const filteredData = students.filter((student) => {
    if (searchField === "studentCode") {
      return student.studentCode
        .toLowerCase()
        .includes(searchText.toLowerCase());
    } else if (searchField === "fullName") {
      const user = accounts.find((u) => u.id === student.userId);
      return (
        user?.fullName.toLowerCase().includes(searchText.toLowerCase()) || false
      );
    }
    return true;
  });

  const columns = [
    {
      title: "Student Code",
      dataIndex: "studentCode",
      key: "studentCode",
      width: 120,
      render: (studentCode: string) => studentCode || "N/A",
      onHeaderCell: () => ({
        style: {
          backgroundColor: headerBg,
          color: headerColor,
          fontWeight: "bold",
        },
      }),
    },
    {
      title: "Full Name",
      dataIndex: "userId",
      key: "userId",
      width: 180,
      render: (userId: string) => {
        const user = accounts.find((u) => u.id === userId);
        return user?.fullName || "N/A";
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
      title: "Major",
      dataIndex: "majorId",
      key: "majorId",
      width: 150,
      render: (majorId: string) => {
        const major = majors.find((m) => m.id === majorId);
        return major?.majorName || "N/A";
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
      title: "Email",
      dataIndex: "userId",
      key: "userId",
      width: 200,
      render: (userId: string) => {
        const user = accounts.find((u) => u.id === userId);
        return user?.email || "N/A";
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
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width: 120,
      render: (phone: string) => phone || "N/A",
      onHeaderCell: () => ({
        style: {
          backgroundColor: headerBg,
          color: headerColor,
          fontWeight: "bold",
        },
      }),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: 200,
      render: (address: string) => address || "N/A",
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
      width: 70,
      render: (record: Student) => {
        const items: MenuProps["items"] = [
          {
            key: "delete",
            label: (
              <Button
                className="border-none w-full text-red-600"
                onClick={() => showDeleteModal(record)}
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
        Student Management
      </div>

      <div className="flex-1 bg-white shadow-md rounded-md p-5">
        <div className="flex justify-between">
          <div className="flex items-center gap-4 mb-4">
            <Select
              defaultValue="studentCode"
              style={{ width: 150 }}
              onChange={handleFieldChange}
            >
              <Select.Option value="studentCode">Student Code</Select.Option>
              <Select.Option value="fullName">Full Name</Select.Option>
            </Select>
            <Input
              placeholder={`Search by ${
                searchField === "studentCode" ? "Student Code" : "Name"
              }`}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 300 }}
            />
          </div>{" "}
        </div>

        <Table
          size="small"
          dataSource={filteredData}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </div>
      <Modal
        title="Confirm Delete"
        open={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        onOk={handleDelete}
        okText="Delete"
        okType="danger"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete the Student?</p>
      </Modal>
    </div>
  );
}

export default ManageUser;
