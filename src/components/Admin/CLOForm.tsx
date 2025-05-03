import React, { useEffect } from "react";
import { Form, Input, Button, FormInstance } from "antd";
import { useParams } from "react-router-dom";

interface CLOFormProps {
  form: FormInstance;
  onFinish: (values: { cloDetails: string; subjectId: string }) => void;
}

const CLOForm: React.FC<CLOFormProps> = ({ form, onFinish }) => {
  const { subjectId } = useParams<{ subjectId: string }>();
  useEffect(() => {
    if (subjectId) {
      form.setFieldsValue({ subjectId });
    }
  }, [subjectId, form]);
  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      {/* <Form.Item
        label="PO Name"
        name="poName"
        rules={[
          { required: true, message: "Please enter the PO name!" },
          {
            // pattern: /^PO.{1,}$/,
            pattern: /^PO\d+$/,

            message:
              "PO name must start with 'PO' and be at least 3 characters.",
          },
        ]}
      >
        <Input placeholder="Enter PO name" />
      </Form.Item> */}

      <Form.Item hidden name="subjectId">
        <Input hidden />
      </Form.Item>

      <Form.Item
        label="Description"
        name="cloDetails"
        rules={[{ required: true, message: "Please enter the description!" }]}
      >
        <Input.TextArea placeholder="Enter description" rows={6} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="w-full">
          Add PO
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CLOForm;
