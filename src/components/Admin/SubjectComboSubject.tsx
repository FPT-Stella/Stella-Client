import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Checkbox, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Subject, MappingSubject, ComboMapping } from "../../models/Subject";
import {
  getSubjcetByComboId,
  updateMappingSubject,
  getSubject,
} from "../../services/Subject";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Input } from "antd";
function SubjectComboSubject() {
  const { combosubjectId } = useParams<{ combosubjectId: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);
  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const headerBg = "#f0f5ff";
  const headerColor = "#1d39c4";
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const mappedSubjects: MappingSubject[] = await getSubjcetByComboId(
          combosubjectId!
        );
        setSelectedSubjectIds(mappedSubjects.map((s) => s.subjectId));

        const allSubjects = await getSubject();
        setAllSubjects(allSubjects);
      } catch (error) {
        console.error("Update failed:", error);
        toast.error("Failed to update.");
      } finally {
        setLoading(false);
      }
    };
    if (combosubjectId) fetchData();
  }, [combosubjectId]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const payload: ComboMapping = {
        subjectComboId: combosubjectId!,
        subjectIds: selectedSubjectIds,
      };
      await updateMappingSubject(payload);
      toast.success("Updated subjects for combo successfully!");
      setModalVisible(false);
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update.");
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<Subject> = [
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
      title: " Term No",
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
  ];

  return (
    <div className="h-full flex flex-col py-16">
      <div className="text-lg font-semibold text-[#2A384D] h-8 mb-5">
        Manage List Subject
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Spin size="large" tip="Loading..." />
        </div>
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={allSubjects.filter((subject) =>
              selectedSubjectIds.includes(subject.id)
            )}
            rowKey="id"
            pagination={false}
            bordered
          />
          <div className="flex justify-end mt-4">
            <Button
              type="primary"
              onClick={() => setModalVisible(true)}
              className="bg-[#635BFF] font-medium "
            >
              Update Subjects
            </Button>
          </div>
        </>
      )}

      <Modal
        title="Update Subjects for Combo"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleUpdate}
        width={700}
        okText="Save"
      >
        {/* Search bar */}
        <Input
          placeholder="Search subject by code subject..."
          className="mb-4"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />

        {/* Checkbox list with scrollable container */}
        <div className="max-h-96 overflow-y-auto pr-2">
          <Checkbox.Group
            style={{ width: "100%" }}
            value={selectedSubjectIds}
            onChange={(checkedValues) => {
              setSelectedSubjectIds(checkedValues as string[]);
            }}
          >
            <div className="flex flex-col space-y-3">
              {allSubjects
                .filter((subject) =>
                  subject.subjectCode
                    .toLowerCase()
                    .includes(searchKeyword.toLowerCase())
                )
                .map((subject) => (
                  <Checkbox key={subject.id} value={subject.id}>
                    ({subject.subjectCode}) {subject.subjectName}
                  </Checkbox>
                ))}
            </div>
          </Checkbox.Group>
        </div>
      </Modal>
    </div>
  );
}

export default SubjectComboSubject;
