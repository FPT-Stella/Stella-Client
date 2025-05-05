import React, { useEffect } from "react";
import { Form, Input, Button, FormInstance } from "antd";
import { useParams } from "react-router-dom";
import { CreateCLO } from "../../models/CLO";
interface CLOFormProps {
  form: FormInstance;
  onFinish: (values: CreateCLO) => void;
}

const CLOForm: React.FC<CLOFormProps> = ({ form, onFinish }) => {
  const { subjectId } = useParams<{ subjectId: string }>();
  useEffect(() => {
    if (subjectId) {
      form.setFieldsValue({ subjectId });
    }
  }, [subjectId, form]);
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        loDetails: "",
      }}
    >
      <Form.Item
        label="CLO Name"
        name="cloName"
        rules={[
          { required: true, message: "Please enter the CLO name!" },
          {
            // pattern: /^PO.{1,}$/,
            pattern: /^CLO\d+$/,

            message:
              "CLO name must start with 'PO' and be at least 4 characters.",
          },
        ]}
      >
        <Input placeholder="Enter PO name" />
      </Form.Item>

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

      <Form.Item hidden name="loDetails">
        <Input hidden />
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
