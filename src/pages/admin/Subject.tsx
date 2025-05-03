import React from "react";
import { useEffect, useState } from "react";
import { Table, Input, Button, Modal, Dropdown, Select } from "antd";
import { MdOutlineMoreVert } from "react-icons/md";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { IoAddCircleOutline } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import type { MenuProps } from "antd";
import { getSubject, deleteSubject } from "../../services/Subject";
import "react-toastify/dist/ReactToastify.css";

import { MdOutlineRemoveRedEye } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Subject } from "../../models/Subject";
function ManageSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const [searchField, setSearchField] = useState<keyof Subject>("subjectCode");
  const [isDeleteModalVisible, setIsDeleteModalVisible] =
    useState<boolean>(false);
  const [selecteditem, setSelecteditem] = useState<string | null>(null);

  const headerBg = "#f0f5ff";
  const headerColor = "#1d39c4";
  const navigate = useNavigate();
  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const data = await getSubject();
        setSubjects(data);
      } catch (error) {
        console.error("Fail to fetching Subject:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubject();
  }, []);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleFieldChange = (value: keyof Subject) => {
    setSearchField(value);
    setSearchText("");
  };

  const filteredData = subjects.filter((item) =>
    item[searchField]
      ?.toString()
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  const handleDelete = async () => {
    if (!selecteditem) return;
    try {
      setLoading(true);
      await deleteSubject(selecteditem);
      const data = await getSubject();
      setSubjects(data);

      toast.success("Subject deleted successfully!");
      setIsDeleteModalVisible(false);
    } catch (error) {
      console.error("Failed to delete Subject:", error);
      toast.error("Failed to delete Subject.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (subjectId: string) => {
    navigate(`/manageSubject/${subjectId}`);
  };

  const showDeleteModal = (id: string) => {
    setSelecteditem(id);
    setIsDeleteModalVisible(true);
  };

  const columns = [
    {
      title: "Subject Code",
      dataIndex: "subjectCode",
      key: "subjectCode",

      onHeaderCell: () => ({
        style: {
          backgroundColor: headerBg,
          color: headerColor,
          fontWeight: "bold",
        },
      }),
    },
    {
      title: "subjectName",
      dataIndex: "subjectName",
      key: "subjectName",

      onHeaderCell: () => ({
        style: {
          backgroundColor: headerBg,
          color: headerColor,
          fontWeight: "bold",
        },
      }),
    },
    {
      title: "subjectDescription",
      dataIndex: "subjectDescription",
      key: "subjectDescription",
      onHeaderCell: () => ({
        style: {
          backgroundColor: headerBg,
          color: headerColor,
          fontWeight: "bold",
        },
      }),
    },
    {
      title: " credits",
      dataIndex: "credits",
      key: "credits",
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
      render: (record: Subject) => {
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
      <ToastContainer />
      <div className="text-lg font-semibold text-[#2A384D] h-8">
        Manage Subjects
      </div>
      <div className="flex-1 bg-white shadow-md rounded-md p-5">
        <div className="mb-4 flex justify-between">
          <div className="flex gap-4">
            <Select
              defaultValue="subjectCode"
              style={{ width: 150 }}
              onChange={handleFieldChange}
              options={[
                { value: "subjectCode", label: "Search by Code" },
                { value: "subjectName", label: "Search by Name" },
              ]}
            />
            <Input
              placeholder={`Search ${
                searchField === "subjectCode" ? "Code" : "Name"
              }`}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 300 }}
            />
          </div>
          <div>
            <Button
              className="bg-[#635BFF] text-white font-medium"
              onClick={() => navigate("/manageSubject/AddSubject")}
            >
              <IoAddCircleOutline /> Add Subject
            </Button>
          </div>
        </div>
        <Table
          size="small"
          dataSource={filteredData}
          columns={columns}
          rowKey="id"
          loading={{
            spinning: loading,
            tip: "Loading...",
          }}
          pagination={{ pageSize: 8 }}
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
        <p>Are you sure you want to delete the Subject?</p>
      </Modal>
    </div>
  );
}

export default ManageSubjects;
