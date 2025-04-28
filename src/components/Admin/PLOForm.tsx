import React from "react";
import { Form, Input, Button, FormInstance } from "antd";
import { useParams } from "react-router-dom";

interface PLOFormProps {
  form: FormInstance;
  onFinish: (values: {
    ploName: string;
    description: string;
    curriculumId: string;
  }) => void;
}

const PLOForm: React.FC<PLOFormProps> = ({ form, onFinish }) => {
  const { curriculumId } = useParams<{ curriculumId: string }>();

  React.useEffect(() => {
    if (curriculumId) {
      form.setFieldsValue({ curriculumId });
    }
  }, [curriculumId, form]);

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
        label="Description"
        name="description"
        rules={[{ required: true, message: "Please enter the description!" }]}
      >
        <Input.TextArea placeholder="Enter description" rows={4} />
      </Form.Item>

      <Form.Item name="curriculumId" hidden>
        <Input />
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
