// MajorForm.tsx
import React from "react";
import { Form, Input, Button, FormInstance } from "antd";
import { Major } from "../../models/Major";
interface MajorFormProps {
  form: FormInstance;
  onFinish: (values: { majorName: string; description: string }) => void;
  initialValues?: Major;
  isEditMode: boolean;
}

const MajorForm: React.FC<MajorFormProps> = ({
  form,
  onFinish,
  initialValues,
  isEditMode,
}) => {
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={initialValues}
    >
      <Form.Item
        label="Major Name"
        name="majorName"
        rules={[{ required: true, message: "Please enter the major name!" }]}
      >
        <Input placeholder="Enter major name" />
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
          {isEditMode ? "Update Major" : "Add Major"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default MajorForm;
