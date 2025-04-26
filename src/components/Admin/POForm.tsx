import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, FormInstance } from "antd";
import { getProgram } from "../../services/Program";
import { Program } from "../../models/Program";

interface POFormProps {
  form: FormInstance;
  onFinish: (values: {
    poName: string;
    description: string;
    programId: string;
  }) => void;
}

const POForm: React.FC<POFormProps> = ({ form, onFinish }) => {
  const [programs, setPrograms] = useState<Program[]>([]);

  useEffect(() => {
    const fetchCurriculums = async () => {
      try {
        const data = await getProgram();
        setPrograms(data);
      } catch (error) {
        console.error("Failed to fetch ptogram:", error);
      }
    };

    fetchCurriculums();
  }, []);

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="PO Name"
        name="poName"
        rules={[
          { required: true, message: "Please enter the PO name!" },
          {
            pattern: /^PO.{1,}$/,
            message:
              "PO name must start with 'PO' and be at least 3 characters.",
          },
        ]}
      >
        <Input placeholder="Enter PO name" />
      </Form.Item>

      <Form.Item
        label="Program"
        name="programId"
        rules={[{ required: true, message: "Please select a program!" }]}
      >
        <Select placeholder="Select curriculum">
          {programs.map((p) => (
            <Select.Option key={p.id} value={p.id}>
              {p.programCode}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: "Please enter the description!" }]}
      >
        <Input.TextArea placeholder="Enter description" rows={4} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="w-full">
          Add PO
        </Button>
      </Form.Item>
    </Form>
  );
};

export default POForm;
