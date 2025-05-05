import { useEffect, useState } from "react";
import { Button, Spin, Modal, Form } from "antd";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import {
  getProgramById,
  deleteProgram,
  updateProgram,
} from "../../services/Program";
import { getMajorByID } from "../../services/Major";
import { Program } from "../../models/Program";
import "react-toastify/dist/ReactToastify.css";
import { Major } from "../../models/Major";
import EditProgram from "../../components/Admin/EditProgram";
function ProgramDetail() {
  const { programId } = useParams<{ programId: string }>();
  const [editForm] = Form.useForm();
  const [isEditModalVisible, setEditModalVisible] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const [program, setProgram] = useState<Program | null>(null);
  const [major, setMajor] = useState<Major | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] =
    useState<boolean>(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!programId) return;

        const programData = await getProgramById(programId);
        setProgram(programData);

        const data = await getMajorByID(programData.majorId);
        setMajor(data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [programId]);
  const handleBack = () => {
    navigate(`/manageProgram`);
  };
  const handleDelete = async () => {
    if (!programId) return;
    try {
      setLoading(true);
      toast.success("Curiculum deleted successfully!");
      await deleteProgram(programId);
      setIsDeleteModalVisible(false);
      navigate(`/manageProgram`);
    } catch (error) {
      console.error("Failed to delete program:", error);
      toast.error("Failed to delete program.");
    } finally {
      setLoading(false);
    }
  };
  const showDeleteModal = () => {
    setIsDeleteModalVisible(true);
  };
  const handleEditProgram = async (values: Partial<Program>) => {
    if (!programId) return;
    try {
      setLoading(true);
      await updateProgram(programId, values);
      const data = await getProgramById(programId);
      setProgram(data);
      setEditModalVisible(false);
      editForm.resetFields();
      setTimeout(() => {
        toast.success("Program updated successfully!");
      }, 1200);
    } catch (error) {
      console.error("Failed to update program:", error);
      toast.error("Failed to update program.");
    } finally {
      setLoading(false);
    }
  };
  const showEditModal = () => {
    setEditModalVisible(true);
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

  return (
    <div className=" flex flex-col px-10 py-5">
      <ToastContainer />

      <h2 className="text-lg w-fit  font-bold text-gray-600 my-4 ">
        View Program: {program.programCode}
      </h2>
      <div className="mt-5">
        <table className="min-w-full border border-gray-200">
          <tbody>
            <tr>
              <td className="py-3.5 border border-gray-200 px-4 font-medium w-40 bg-[#f0f5ff] text-[#1d39c4]">
                Program ID :
              </td>
              <td className="py-3.5 border border-gray-200 px-4 text-black">
                {program.id}
              </td>
            </tr>
            <tr>
              <td className="py-3.5 border border-gray-200 px-4 font-medium w-40 bg-[#f0f5ff] text-[#1d39c4]">
                Program Code :
              </td>
              <td className="py-3.5 border border-gray-200 px-4 text-black">
                {program.programCode}
              </td>
            </tr>
            <tr>
              <td className="py-3.5 border border-gray-200 px-4 font-medium w-40 bg-[#f0f5ff] text-[#1d39c4]">
                Program Name :
              </td>
              <td className="py-3.5 border border-gray-200 px-4 text-black">
                {program.programName}
              </td>
            </tr>
            <tr>
              <td className="py-3.5 border border-gray-200 px-4 font-medium  w-40 bg-[#f0f5ff] text-[#1d39c4]">
                Major Code:
              </td>
              <td className="py-3.5 border border-gray-200 px-4 text-black">
                {major?.majorName || "N/A"}
              </td>
            </tr>
            <tr>
              <td className="py-3.5 border border-gray-200 px-4 font-medium  w-40 bg-[#f0f5ff] text-[#1d39c4]">
                Description:
              </td>
              <td className="py-3.5 border border-gray-200 px-4 text-black ">
                {program.description}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-5 mt-8">
        <Button
          className="bg-[#635BFF] font-medium text-white"
          onClick={showEditModal}
        >
          Edit Program
        </Button>
        <Button
          className="bg-red-500 font-medium text-white"
          onClick={showDeleteModal}
        >
          Delete
        </Button>
        <Button
          className="bg-blue-500 font-medium text-white"
          onClick={handleBack}
        >
          Back Program Management
        </Button>
      </div>
      <Modal
        title="Edit Major"
        open={isEditModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
        }}
        footer={null}
      >
        <EditProgram
          form={editForm}
          onFinish={handleEditProgram}
          initialValues={program}
        />
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
        <p>Are you sure you want to delete the Program?</p>
      </Modal>
    </div>
  );
}

export default ProgramDetail;
