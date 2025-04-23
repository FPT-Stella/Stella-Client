import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, FormInstance } from "antd";
import { Major } from "../../models/Major";
import { Program } from "../../models/Program";
import { getMajor } from "../../services/Major";

interface EditProgramProps {
  form: FormInstance;
  onFinish: (values: Partial<Program>) => void;
  initialValues: Program;
}

const EditProgram: React.FC<EditProgramProps> = ({
  form,
  onFinish,
  initialValues,
}) => {
  const [majors, setMajors] = useState<Major[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const data = await getMajor();
        setMajors(data);
      } catch (error) {
        console.error("Failed to fetch majors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMajors();
  }, []);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="Major"
        name="majorId"
        rules={[{ required: true, message: "Please select a major!" }]}
      >
        <Select placeholder="Select a major" loading={loading}>
          {majors.map((major) => (
            <Select.Option key={major.id} value={major.id}>
              {major.majorName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Program Code"
        name="programCode"
        rules={[{ required: true, message: "Please enter the program code!" }]}
      >
        <Input placeholder="Enter program code" />
      </Form.Item>
      <Form.Item
        label="Program Name"
        name="programName"
        rules={[{ required: true, message: "Please enter the program name!" }]}
      >
        <Input placeholder="Enter program name" />
      </Form.Item>
      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: "Please enter the description!" }]}
      >
        <Input.TextArea placeholder="Enter description" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="w-full">
          Update Program
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditProgram;
