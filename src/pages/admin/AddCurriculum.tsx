import { useEffect, useState } from "react";
import { Input, Button, Form, Select } from "antd";
import { useNavigate } from "react-router";
import { AddCurriculum } from "../../services/Curriculum";
import { CreateCurriculum } from "../../models/Curriculum";
import { getProgram } from "../../services/Program";
import { Program } from "../../models/Program";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AxiosError } from "axios";
function AddNewCurriculum() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [programs, setPrograms] = useState<Program[]>([]);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const data = await getProgram();
        setPrograms(data);
      } catch (error) {
        console.error("Failed to fetch programs:", error);
        toast.error("Failed to load programs");
      }
    };
    fetchPrograms();
  }, []);

  const handleSubmit = async (values: CreateCurriculum) => {
    try {
      setLoading(true);

      const curriculumData = {
        ...values,
        description: JSON.stringify(values.description),
      };

      const response = await AddCurriculum(curriculumData);
      console.log(response);

      toast.success("Curriculum added successfully!");

      navigate(`/manageCurriculum`);
    } catch (error) {
      // Sử dụng AxiosError để xác định kiểu lỗi
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
        <span className="text-[#2A384D]"> Add Curriculum</span>
      </div>
      <div className="flex-1 bg-white shadow-md rounded-md py-5 px-20">
        <h2 className="text-lg w-fit mx-auto font-bold text-gray-600 my-4 border-b-2 border-gray-600">
          Add New Curriculum
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
              rules={[
                {
                  required: true,
                  message: "Please input a valid start year!",
                },
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve();
                    if (value <= 2000) {
                      return Promise.reject(
                        new Error("Start year must be greater than 2000!")
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input type="number" placeholder="Enter start year" />
            </Form.Item>

            <Form.Item
              label="End Year"
              name="endYear"
              rules={[
                {
                  required: true,
                  message: "Please input end year!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const startYear = getFieldValue("startYear");
                    if (!value) return Promise.resolve();
                    if (startYear && value <= startYear) {
                      return Promise.reject(
                        new Error("End year must be greater than Start year!")
                      );
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
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
              autoSize={{ minRows: 10, maxRows: 25 }}
            />
          </Form.Item>

          <Form.Item className="flex justify-end ">
            <Button
              onClick={() => navigate("/manageCurriculum")}
              className="mr-5"
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default AddNewCurriculum;
