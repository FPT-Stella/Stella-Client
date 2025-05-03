import React, { useEffect, useState } from "react";
import { Button, Spin, Modal, Form, Input } from "antd";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { getProgramById } from "../../services/Program";
import "react-toastify/dist/ReactToastify.css";
import { Program } from "../../models/Program";
import {
  getComboSubjectById,
  deleteComboSubject,
  updateComboSubject,
} from "../../services/Subject";
import { AxiosError } from "axios";
import SubjectComboSubject from "../../components/Admin/subjectComboSubject";
import { ComboSubject, UpdateComboSubject } from "../../models/Subject";
function ComboSubjectDetail() {
  const { programId } = useParams<{ programId: string }>();
  const { combosubjectId } = useParams<{ combosubjectId: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [program, setProgram] = useState<Program | null>(null);
  const navigate = useNavigate();
  const [editing, setEditing] = useState<ComboSubject | null>(null);
  const [editForm] = Form.useForm();
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [comboSubject, setComboSubject] = useState<ComboSubject | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!programId) return;

        const programData = await getProgramById(programId);
        setProgram(programData);
        const data = await getComboSubjectById(combosubjectId!);
        setComboSubject(data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [programId, combosubjectId]);
  const showEditModal = (combo: ComboSubject) => {
    setEditing(combo);
    setIsEditModalVisible(true);
    editForm.setFieldsValue({
      comboName: combo.comboName,
      description: combo.description,
      programOutcome: combo.programOutcome,
    });
  };

  const handleEdit = async (values: UpdateComboSubject) => {
    if (!editing) return;
    try {
      setLoading(true);
      await updateComboSubject(editing.id, values);
      toast.success("Subject updated successfully!");
      const data = await getComboSubjectById(combosubjectId!);
      setComboSubject(data);

      setIsEditModalVisible(false);
      setEditing(null);
      editForm.resetFields();
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Failed to update:", error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast.error(error.response.data.details);
        } else {
          toast.error("Failed to update.");
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
    if (!combosubjectId) return;
    try {
      setLoading(true);
      toast.success("Combo Name delete successfully!");
      await deleteComboSubject(combosubjectId);

      setIsDeleteModalVisible(false);

      navigate(`/manageProgram/${programId}`);
    } catch (error) {
      console.error("Failed to delete Combo Subject:", error);
      toast.error("Failed to delete Combo Subject.");
    } finally {
      setLoading(false);
    }
  };

  const showDeleteModal = () => {
    setIsDeleteModalVisible(true);
  };
  const handleBack = () => {
    navigate(`/manageProgram`);
  };
  const handleBack2 = () => {
    navigate(`/manageProgram/${programId}`);
  };
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spin size="large" tip="Loading curriculum details..." />
      </div>
    );
  }

  if (!program) {
    return <div>Program not found</div>;
  }
  if (!comboSubject) {
    return <div>Program not found</div>;
  }
  return (
    <div className=" flex flex-col px-10 py-5">
      <ToastContainer />
      <div className="text-lg font-semibold h-8 flex gap-2 mb-3">
        <span className="text-gray-500 cursor-pointer " onClick={handleBack}>
          Program Management /
        </span>
        <span className="text-gray-500 cursor-pointer " onClick={handleBack2}>
          {program.programCode} /
        </span>
        <span className="text-[#2A384D]"> {comboSubject.comboName}</span>
      </div>
      <div className="flex-1 bg-white shadow-md rounded-md py-5 px-10 ">
        <h2 className="text-lg w-fit mx-auto font-bold text-gray-600 my-4 border-b-2 border-gray-600">
          View Combo Subject: {comboSubject.comboName}
        </h2>
        <div className="mt-5">
          {" "}
          <table className="min-w-full border border-gray-200">
            <tbody>
              <tr>
                <td className="py-3.5 border border-gray-200 px-4 font-medium w-40">
                  Combo Subject ID :
                </td>
                <td className="py-3.5 border border-gray-200 px-4">
                  {comboSubject.id}
                </td>
              </tr>
              <tr>
                <td className="py-3.5 border border-gray-200 px-4 font-medium w-40">
                  Combo Name:
                </td>
                <td className="py-3.5 border border-gray-200 px-4">
                  {comboSubject.comboName}
                </td>
              </tr>
              <tr>
                <td className="py-3.5 border border-gray-200 px-4 font-medium w-40">
                  Description :
                </td>
                <td className="py-3.5 border border-gray-200 px-4">
                  {comboSubject.description}
                </td>
              </tr>

              <tr>
                <td className="py-3.5 border border-gray-200 px-4 font-medium  w-40">
                  Program Outcome:
                </td>
                <td className="py-3.5 border border-gray-200 px-4 ">
                  {comboSubject.programOutcome}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex justify-end gap-5 mt-8">
          <Button
            className="bg-[#635BFF] font-medium text-white"
            onClick={() => showEditModal(comboSubject)}
          >
            Edit Combo Subject
          </Button>
        </div>
        <div>
          <SubjectComboSubject />
        </div>
        <div className="flex justify-end gap-5 mt-8">
          <Button
            className="bg-red-500 font-medium text-white"
            onClick={showDeleteModal}
          >
            Delete
          </Button>
          <Button
            className="bg-[#635BFF] font-medium text-white"
            onClick={handleBack2}
          >
            Back Program Management
          </Button>
        </div>
      </div>
      <Modal
        title="Edit Combo Subject "
        width="60%"
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditing(null);
          editForm.resetFields();
        }}
        footer={null}
        style={{ top: "50%", transform: "translateY(-50%)" }}
      >
        <Form form={editForm} layout="vertical" onFinish={handleEdit}>
          <Form.Item
            label="Combo Name"
            name="comboName"
            rules={[{ required: true, message: "Please enter the PLO name!" }]}
          >
            <Input placeholder="Enter PLO name" />
          </Form.Item>

          <Form.Item
            label="Program Outcome"
            name="programOutcome"
            rules={[
              { required: true, message: "Please enter the description!" },
            ]}
          >
            <Input.TextArea
              placeholder="Enter description"
              autoSize={{ minRows: 8, maxRows: 12 }}
            />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please enter the description!" },
            ]}
          >
            <Input.TextArea
              placeholder="Enter description"
              autoSize={{ minRows: 8, maxRows: 12 }}
            />
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
        <p>Are you sure you want to delete the ComboSubject?</p>
      </Modal>
    </div>
  );
}

export default ComboSubjectDetail;
