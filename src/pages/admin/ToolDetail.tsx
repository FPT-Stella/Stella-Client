import React, { useEffect, useState } from "react";
import { getToolById, deleteTool, updateTool } from "../../services/Tool";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Spin, Modal, Form, Input } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Tool } from "../../models/Tool";
function ToolDetail() {
  const { toolId } = useParams<{ toolId: string }>();
  const [tool, SetTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const [isEditModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [editForm] = Form.useForm();

  const [isDeleteModalVisible, setIsDeleteModalVisible] =
    useState<boolean>(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!toolId) return;
        const Data = await getToolById(toolId);
        SetTool(Data);
        editForm.setFieldsValue({
          toolName: Data.toolName,

          description: JSON.parse(Data.description),
        });
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toolId, editForm]);
  const handleBack = () => {
    navigate(`/manageTool`);
  };
  const handleEdit = async (values: Partial<Tool>) => {
    if (!toolId) return;

    try {
      const edittool = {
        ...values,
        description: JSON.stringify(values.description),
      };

      setLoading(true);
      await updateTool(toolId, edittool);

      const data = await getToolById(toolId);
      SetTool(data);

      toast.success("Tool updated successfully!", {
        autoClose: 1500,
      });

      setEditModalVisible(false);
      editForm.resetFields();
    } catch (error) {
      console.error("Failed to update tool:", error);
      toast.error("Failed to update tool.");
    } finally {
      setLoading(false);
    }
  };
  const showEditModal = () => {
    setEditModalVisible(true);
  };
  const handleDelete = async () => {
    if (!toolId) return;
    try {
      setLoading(true);
      toast.success("Tool deleted successfully!");
      await deleteTool(toolId);
      setIsDeleteModalVisible(false);

      navigate(`/manageTool`);
    } catch (error) {
      console.error("Failed to delete tool:", error);
      toast.error("Failed to delete tool.");
    } finally {
      setLoading(false);
    }
  };
  const showDeleteModal = () => {
    setIsDeleteModalVisible(true);
  };
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spin size="large" tip="Loading curriculum details..." />
      </div>
    );
  }

  if (!tool) {
    return <div>Tool not found</div>;
  }

  return (
    <div className=" flex flex-col px-10 py-5">
      <ToastContainer position="top-right" autoClose={1500} />
      <div className="text-lg font-semibold h-8 flex gap-2 mb-3">
        <span className="text-gray-500 cursor-pointer " onClick={handleBack}>
          Tool Management /
        </span>
        <span className="text-[#2A384D]"> {tool.toolName} </span>
      </div>
      <div className="flex flex-col bg-white shadow-md rounded-md py-5 px-10  min-h-[80vh]">
        <h2 className="text-lg w-fit mx-auto font-bold text-gray-600 my-4 border-b-2 border-gray-600">
          {tool.toolName}
        </h2>
        <div className="mt-5 flex-1">
          <table className="min-w-full border border-gray-200">
            <tbody>
              <tr>
                <td className="py-3.5 border border-gray-200 px-4 font-medium w-40 bg-[#f0f5ff] text-[#1d39c4]">
                  ID :
                </td>
                <td className="py-3.5 border border-gray-200 px-4 text-black ">
                  {tool.id}
                </td>
              </tr>

              <tr>
                <td className="py-3.5 border border-gray-200 px-4 font-medium  w-40  bg-[#f0f5ff] text-[#1d39c4]">
                  Curriculum Name:
                </td>
                <td className="py-3.5 border border-gray-200 px-4 text-black">
                  {tool.toolName}
                </td>
              </tr>
              <tr>
                <td className="py-3.5 border border-gray-200 px-4 font-medium  w-40  bg-[#f0f5ff] text-[#1d39c4]">
                  Description:
                </td>
                <td className="py-3.5 border border-gray-200 px-4 text-black">
                  {JSON.parse(tool.description)
                    .split("\n")
                    .map((line: string, index: number) => (
                      <React.Fragment key={index}>
                        {line}
                        {index !==
                          JSON.parse(tool.description).split("\n").length -
                            1 && <br />}
                      </React.Fragment>
                    ))}
                </td>
              </tr>

              <tr>
                <td className="py-3.5 border border-gray-200 px-4 font-medium  w-40  bg-[#f0f5ff] text-[#1d39c4]">
                  Crated Date :
                </td>
                <td className="py-3.5 border border-gray-200 px-4 text-black ">
                  {new Date(tool.createdAt).toLocaleDateString("vi-VN")}
                </td>
              </tr>
              <tr>
                <td className="py-3.5 border border-gray-200 px-4 font-medium  w-40  bg-[#f0f5ff] text-[#1d39c4]">
                  Updated Date:
                </td>
                <td className="py-3.5 border border-gray-200 px-4 text-black">
                  {new Date(tool.updatedAt).toLocaleDateString("vi-VN")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex justify-end gap-5 mt-8 h-10">
          <Button
            className="bg-[#635BFF] font-medium text-white"
            onClick={showEditModal}
          >
            Edit Tool
          </Button>
          <Button
            className="bg-red-500 font-medium text-white"
            onClick={showDeleteModal}
          >
            Delete
          </Button>
          <Button
            className="bg-[#635BFF] font-medium text-white"
            onClick={handleBack}
          >
            Back Tool Management
          </Button>
        </div>
      </div>
      <Modal
        title="Edit Tool"
        open={isEditModalVisible}
        onCancel={() => setEditModalVisible(false)}
        width={"60%"}
        footer={null}
      >
        <Form form={editForm} layout="vertical" onFinish={handleEdit}>
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

export default ToolDetail;
