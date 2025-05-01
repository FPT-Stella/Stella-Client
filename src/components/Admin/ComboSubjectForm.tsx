import React from "react";
import { Form, Input, Button, FormInstance } from "antd";
import { useParams } from "react-router-dom";
import { CreateComboSubject } from "../../models/Subject";
interface ComboSubjectFormProps {
  form: FormInstance;
  onFinish: (values: CreateComboSubject) => void;
}

const ComboSubjectForm: React.FC<ComboSubjectFormProps> = ({
  form,
  onFinish,
}) => {
  const { programId } = useParams<{ programId: string }>();

  React.useEffect(() => {
    if (programId) {
      form.setFieldsValue({ programId });
    }
  }, [programId, form]);

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="Combo Name"
        name="comboName"
        rules={[{ required: true, message: "Please enter the Combo name!" }]}
      >
        <Input placeholder="Enter Combo name" />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: "Please enter the description!" }]}
      >
        <Input.TextArea placeholder="Enter description" rows={8} />
      </Form.Item>
      <Form.Item
        label="Program Outcome"
        name="programOutcome"
        rules={[
          { required: true, message: "Please enter the Program Outcome!" },
        ]}
      >
        <Input.TextArea placeholder="Enter description" rows={8} />
      </Form.Item>
      <Form.Item name="programId" hidden>
        <Input />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="w-full">
          Add
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ComboSubjectForm;
