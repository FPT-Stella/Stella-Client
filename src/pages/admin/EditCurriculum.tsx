import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Form, Input, Select, Button, Spin } from "antd";
import { getProgram } from "../../services/Program";
import { Program } from "../../models/Program";
import { updateCurriculum, getCurriculumById } from "../../services/Curriculum";
import { Curriculum } from "../../models/Curriculum";

function EditCurriculum() {
  const { curriculumId } = useParams<{ curriculumId: string }>();
  const [form] = Form.useForm();
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!curriculumId) return;
        const curriculumData = await getCurriculumById(curriculumId);
        setCurriculum(curriculumData);
        const programsData = await getProgram();
        setPrograms(programsData);
        form.setFieldsValue({
          curriculumCode: curriculumData.curriculumCode,
          curriculumName: curriculumData.curriculumName,
          programId: curriculumData.programId,
          description: curriculumData.description,
          totalCredit: curriculumData.totalCredit,
          startYear: curriculumData.startYear,
          endYear: curriculumData.endYear,
        });
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to load curriculum data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [curriculumId, form]);
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spin size="large" tip="Loading curriculum details..." />
      </div>
    );
  }
  const handleSubmit = async (values: Partial<Curriculum>) => {
    try {
      if (!curriculumId) return;
      setLoading(true);
      await updateCurriculum(curriculumId, values);
      toast.success("Curriculum updated successfully!");
      navigate("/manageCurriculum");
    } catch (error) {
      console.error("Failed to update curriculum:", error);
      toast.error("Failed to update curriculum");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col px-10 py-5">
      <ToastContainer />
      <div className="text-lg font-semibold h-8 flex gap-2 mb-3">
        <span
          className="text-gray-500 cursor-pointer"
          onClick={() => navigate("/manageCurriculum")}
        >
          Curriculum Management /
        </span>
        <span className="text-[#2A384D]"> Edit Curriculum</span>
      </div>
      <div className="flex-1 bg-white shadow-md rounded-md py-5 px-20">
        <h2 className="text-lg w-fit mx-auto font-bold text-gray-600 my-4 border-b-2 border-gray-600">
          Edit Curriculum: {curriculum?.curriculumCode}
        </h2>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="w-full"
        >
          <Form.Item
            label="Program"
            name="programId"
            rules={[{ required: true, message: "Please select a program!" }]}
          >
            <Select placeholder="Select a program">
              {programs.map((program) => (
                <Select.Option key={program.id} value={program.id}>
                  {program.programCode}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Curriculum Name"
            name="curriculumName"
            rules={[
              { required: true, message: "Please input curriculum name!" },
            ]}
          >
            <Input placeholder="Enter curriculum name" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-5">
            <Form.Item
              label="Curriculum Code"
              name="curriculumCode"
              rules={[
                { required: true, message: "Please input curriculum code!" },
              ]}
            >
              <Input placeholder="Enter curriculum code" />
            </Form.Item>

            <Form.Item
              label="Total Credit"
              name="totalCredit"
              rules={[
                { required: true, message: "Please input total credit!" },
              ]}
            >
              <Input type="number" placeholder="Enter total credit" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <Form.Item
              label="Start Year"
              name="startYear"
              rules={[{ required: true, message: "Please input start year!" }]}
            >
              <Input type="number" placeholder="Enter start year" />
            </Form.Item>

            <Form.Item
              label="End Year"
              name="endYear"
              rules={[{ required: true, message: "Please input end year!" }]}
            >
              <Input type="number" placeholder="Enter end year" />
            </Form.Item>
          </div>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please input description!" }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Enter description"
              autoSize={{ minRows: 4, maxRows: 20 }}
            />
          </Form.Item>

          <div className="flex justify-end gap-4">
            <Button onClick={() => navigate("/manageCurriculum")}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Update
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default EditCurriculum;
