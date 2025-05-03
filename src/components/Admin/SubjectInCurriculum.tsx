import { useEffect, useState } from "react";
import {
  getSubjectInCurriculumByCurriID,
  getSubjectByID,
  getSubject,
  addSubjectInCurriculum,
  deleteSubjectInCurriculum,
} from "../../services/Subject";
import { Subject, CreateSjCurriculum } from "../../models/Subject";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import {
  Button,
  Dropdown,
  Input,
  MenuProps,
  Modal,
  Table,
  Checkbox,
} from "antd";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { MdOutlineMoreVert } from "react-icons/md";
import { IoAddCircleOutline } from "react-icons/io5";
import { AxiosError } from "axios";

function SubjectInCurriculum() {
  type CheckboxValueType = string | number;

  const { curriculumId } = useParams<{ curriculumId: string }>();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [filteredsubject, setFilteredSubject] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");

  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);

  const headerBg = "#f0f5ff";
  const headerColor = "#1d39c4";

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      try {
        const subjectRefs = await getSubjectInCurriculumByCurriID(
          curriculumId!
        );

        const detailedSubjects: Subject[] = await Promise.all(
          subjectRefs.map((ref: CreateSjCurriculum) =>
            getSubjectByID(ref.subjectId)
          )
        );

        const sortedSubjects = detailedSubjects.sort(
          (a, b) => a.termNo - b.termNo
        );

        setSubjects(sortedSubjects);
        setFilteredSubject(sortedSubjects);
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [curriculumId]);

  const handleSearch = (value: string) => {
    setSearchText(value);
    const filteredData = subjects.filter((sj) =>
      sj.subjectCode.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSubject(filteredData);
  };

  const openAddModal = async () => {
    try {
      const all = await getSubject();
      setAllSubjects(all);
      setIsAddModalOpen(true);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Failed to load subject:", error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast.error(error.response.data.details);
        } else {
          toast.error("Failed to load.");
        }
      } else {
        console.error("Unexpected error:", error);
        toast.error("Failed to load.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubjects = async () => {
    try {
      await Promise.all(
        selectedSubjects.map((subjectId) =>
          addSubjectInCurriculum({ subjectId, curriculumId: curriculumId! })
        )
      );
      toast.success("Add Subject success");
      setIsAddModalOpen(false);
      setSelectedSubjects([]);

      const subjectRefs = await getSubjectInCurriculumByCurriID(curriculumId!);
      const detailedSubjects = await Promise.all(
        subjectRefs.map((ref: CreateSjCurriculum) =>
          getSubjectByID(ref.subjectId)
        )
      );
      const sorted = detailedSubjects.sort((a, b) => a.termNo - b.termNo);
      setSubjects(sorted);
      setFilteredSubject(sorted);
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
    }
  };

  const confirmDeleteSubject = async () => {
    if (!subjectToDelete) return;
    try {
      await deleteSubjectInCurriculum(subjectToDelete.id);
      toast.success("Delete Success");
      setSubjects(subjects.filter((s) => s.id !== subjectToDelete.id));
      setFilteredSubject(
        filteredsubject.filter((s) => s.id !== subjectToDelete.id)
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Failed to delete:", error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast.error(error.response.data.details);
        } else {
          toast.error("Failed to delete.");
        }
      } else {
        console.error("Unexpected error:", error);
        toast.error("Failed to delete.");
      }
    } finally {
      setIsDeleteModalOpen(false);
      setSubjectToDelete(null);
    }
  };

  const columns = [
    {
      title: "Subject Code",
      dataIndex: "subjectCode",
      key: "subjectCode",
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
      title: "Subject Name",
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
      title: "Term No",
      dataIndex: "termNo",
      key: "termNo",
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
      render: (record: Subject) => {
        const items: MenuProps["items"] = [
          {
            key: "delete",
            label: (
              <Button
                className="border-none w-full text-red-600"
                onClick={() => {
                  setSubjectToDelete(record);
                  setIsDeleteModalOpen(true);
                }}
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
      <div className="text-lg font-semibold text-[#2A384D] h-8 mb-4">
        Manage Program Learning Outcomes
      </div>

      <div className="mb-4 flex justify-between">
        <Input
          placeholder="Search by Subject Code"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 300 }}
        />
        <div>
          <Button
            className="bg-[#635BFF] text-white font-medium"
            onClick={openAddModal}
          >
            <IoAddCircleOutline /> Add Subject In Curriculum
          </Button>
        </div>
      </div>

      <Table
        size="small"
        dataSource={filteredsubject}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      {/* Modal Thêm Môn */}
      <Modal
        title="Chọn môn học để thêm vào chương trình"
        open={isAddModalOpen}
        onOk={handleAddSubjects}
        onCancel={() => setIsAddModalOpen(false)}
        okText="Add"
        cancelText="Cancel"
      >
        <Checkbox.Group
          style={{ width: "100%" }}
          onChange={(checkedValues: CheckboxValueType[]) =>
            setSelectedSubjects(checkedValues as string[])
          }
        >
          <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto">
            {allSubjects.map((subject) => {
              const isDisabled = subjects.some((s) => s.id === subject.id);
              return (
                <Checkbox
                  key={subject.id}
                  value={subject.id}
                  disabled={isDisabled}
                >
                  {subject.subjectCode} - {subject.subjectName}
                </Checkbox>
              );
            })}
          </div>
        </Checkbox.Group>
      </Modal>

      {/* Modal Xác nhận xoá */}
      <Modal
        open={isDeleteModalOpen}
        onOk={confirmDeleteSubject}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Xoá"
        cancelText="Hủy"
        title="Xác nhận xoá"
      >
        Do you want deletedelete
        <strong>{subjectToDelete?.subjectName}</strong> ?
      </Modal>
    </div>
  );
}

export default SubjectInCurriculum;
