import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, FormInstance } from "antd";
import { getCurriculum } from "../../services/Curriculum";
import { Curriculum } from "../../models/Curriculum";

interface PLOFormProps {
  form: FormInstance;
  onFinish: (values: {
    ploName: string;
    description: string;
    curriculumId: string;
  }) => void;
}

const PLOForm: React.FC<PLOFormProps> = ({ form, onFinish }) => {
  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);

  useEffect(() => {
    const fetchCurriculums = async () => {
      try {
        const data = await getCurriculum();
        setCurriculums(data);
      } catch (error) {
        console.error("Failed to fetch curriculums:", error);
      }
    };

    fetchCurriculums();
  }, []);

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="PLO Name"
        name="ploName"
        rules={[{ required: true, message: "Please enter the PLO name!" }]}
      >
        <Input placeholder="Enter PLO name" />
      </Form.Item>

      <Form.Item
        label="Curriculum"
        name="curriculumId"
        rules={[{ required: true, message: "Please select a curriculum!" }]}
      >
        <Select placeholder="Select curriculum">
          {curriculums.map((curriculum) => (
            <Select.Option key={curriculum.id} value={curriculum.id}>
              {curriculum.curriculumCode}
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
          Add PLO
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PLOForm;
