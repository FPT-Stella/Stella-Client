import React, { useEffect, useState } from "react";
import { Input, Button, Form, Select, Switch, Radio } from "antd";
import { AxiosError } from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router";
import { getSubject, addSubject } from "../../services/Subject";
import { CreateSubject, Subject } from "../../models/Subject";

function AddSubject() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [prerequisite, setPrerequisite] = useState(false);

  const [form] = Form.useForm();
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await getSubject();
        setSubjects(data);
      } catch (error) {
        console.error("Failed to fetch programs:", error);
        toast.error("Failed to load programs");
      }
    };
    fetchSubjects();
  }, []);
  const handleSubmit = async (values: CreateSubject) => {
    try {
      setLoading(true);

      const SubjectData = {
        ...values,
        prerequisite: prerequisite,
        prerequisiteName: prerequisite ? values.prerequisiteName : "",
        subjectdescription: JSON.stringify(values.subjectDescription),
        sysllabusDescription: JSON.stringify(values.sysllabusDescription),
        studentTask: JSON.stringify(values.studentTask),
        note: JSON.stringify(values.note),
        topic: JSON.stringify(values.topic),
      };

      const response = await addSubject(SubjectData);
      console.log(response);

      toast.success("Add Subject Success!", {
        autoClose: 2000,
      });

      setTimeout(() => {
        navigate(`/manageSubject`);
      }, 2000);
    } catch (error) {
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
          onClick={() => navigate("/manageSubject")}
        >
          Subject Management /
        </span>
        <span className="text-[#2A384D]"> Add New Subject</span>
      </div>
      <div className="flex-1 bg-white shadow-md rounded-md py-5 px-20">
        <h2 className="text-lg w-fit mx-auto font-bold text-gray-600 my-4 border-b-2 border-gray-600">
          Add New Subject
        </h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="w-full"
          initialValues={{
            prerequisite: false,
            prerequisiteName: "",
          }}
        >
          <Form.Item
            label="Subject Name"
            name="subjectName"
            rules={[{ required: true, message: "Please input SubjectName!" }]}
          >
            <Input placeholder="Enter curriculum name" />
          </Form.Item>
          <Form.Item
            label="Subject Code"
            name="subjectCode"
            rules={[{ required: true, message: "Please input Subject Code!" }]}
          >
            <Input placeholder="Enter curriculum code" />
          </Form.Item>
          <Form.Item
            label="Subject Description"
            name="subjectDescription"
            rules={[{ required: true, message: "Please input description!" }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Enter description"
              autoSize={{ minRows: 4, maxRows: 8 }}
            />
          </Form.Item>
          <div className="grid grid-cols-2 gap-5">
            <Form.Item
              label="Credit"
              name="credits"
              rules={[{ required: true, message: "Please input credit!" }]}
            >
              <Input type="number" placeholder="Enter credit" />
            </Form.Item>
            <Form.Item
              label="Degree Level"
              name="degreeLevel"
              rules={[
                { required: true, message: "Please input degree Level!" },
              ]}
            >
              <Input placeholder="Enter degree level" />
            </Form.Item>
          </div>

          <Form.Item label="Is Prerequisite?" name="prerequisite">
            <Switch
              checked={prerequisite}
              onChange={(checked) => {
                setPrerequisite(checked);
                form.setFieldsValue({ prerequisiteName: "" });
              }}
            />
          </Form.Item>

          {prerequisite && (
            <Form.Item
              label="Prerequisite Name"
              name="prerequisiteName"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn môn học tiên quyết!",
                },
              ]}
            >
              <Select placeholder="Chọn môn học">
                {subjects.map((subject) => (
                  <Select.Option key={subject.id} value={subject.subjectCode}>
                    {subject.subjectCode}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item
            label="Time Allocation"
            name="timeAllocation"
            rules={[
              { required: true, message: "Please input timeAllocation!" },
            ]}
          >
            <Input placeholder="Enter timeAllocation" />
          </Form.Item>

          <Form.Item
            label="Sysllabus Description"
            name="sysllabusDescription"
            rules={[{ required: true, message: "Please input description!" }]}
          >
            <Input.TextArea
              placeholder="Enter description"
              autoSize={{ minRows: 12, maxRows: 25 }}
            />
          </Form.Item>
          <Form.Item
            label="Student Task"
            name="studentTask"
            rules={[{ required: true, message: "Please input student Task!" }]}
          >
            <Input.TextArea
              placeholder="Enter description"
              autoSize={{ minRows: 8, maxRows: 18 }}
            />
          </Form.Item>
          <div className="grid grid-cols-2 gap-5">
            <Form.Item
              label="Scoring Scale"
              name="scoringScale"
              rules={[
                { required: true, message: "Please input Scoring Scale!" },
              ]}
            >
              <Input type="number" placeholder="Enter ScoringScale" />
            </Form.Item>
            <Form.Item
              label="min Avg Mark To Pass"
              name="minAvgMarkToPass"
              rules={[
                { required: true, message: "Please input minAvgMarkToPass!" },
              ]}
            >
              <Input type="number" placeholder="Enter minAvgMarkToPass" />
            </Form.Item>
          </div>
          <Form.Item
            label="Note"
            name="note"
            rules={[{ required: true, message: "Please input note!" }]}
          >
            <Input.TextArea
              placeholder="Enter note"
              autoSize={{ minRows: 4, maxRows: 10 }}
            />
          </Form.Item>
          <Form.Item
            label="Topic"
            name="topic"
            rules={[{ required: true, message: "Please input topic!" }]}
          >
            <Input.TextArea
              placeholder="Enter note"
              autoSize={{ minRows: 4, maxRows: 10 }}
            />
          </Form.Item>
          <Form.Item
            label="Teaching Methods"
            name="learningTeachingType"
            rules={[
              { required: true, message: "Please input Teaching Methods!" },
            ]}
          >
            <Radio.Group>
              <Radio value={true}>Teaching at School</Radio>
              <Radio value={false}>Learning Online</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="Semester"
            name="termNo"
            rules={[{ required: true, message: "Select Semester!" }]}
          >
            <Select placeholder="Selecr semester">
              {[...Array(10).keys()].map((number) => (
                <Select.Option key={number} value={number}>
                  {number}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item className="flex justify-end ">
            <Button onClick={() => navigate("/manageSubject")} className="mr-5">
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

export default AddSubject;
