import { useEffect, useState } from "react";
import { Form, Input, Select, Button } from "antd";
import { toast } from "react-toastify";
import { getAccountByUsername, getStudentByUserId } from "../../services/user";
import { getMajor } from "../../services/Major";
import { getProgramsByMajor } from "../../services/Program";
import { updateStudentById } from "../../services/user";

interface Student {
  id: string;
  userId: string;
  majorId: string;
  studentCode: string;
  phone: string;
  address: string;
}

interface Major {
  id: string;
  majorName: string;
  description: string;
}

interface Program {
  id: string;
  majorId: string;
  description: string;
  programCode: string;
  programName: string;
}

function Profile() {
  const [form] = Form.useForm();
  const [student, setStudent] = useState<Student | null>(null);
  const [majors, setMajors] = useState<Major[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        // Get username from localStorage
        const userData = localStorage.getItem("userData");
        if (!userData) {
          toast.error("User data not found");
          return;
        }

        const { username } = JSON.parse(userData);

        // Get user ID
        const accountResponse = await getAccountByUsername(username);
        const userId = accountResponse.id;

        // Get student information
        const studentData = await getStudentByUserId(userId);
        setStudent(studentData);

        // Set form values
        form.setFieldsValue({
          studentCode: studentData.studentCode,
          phone: studentData.phone,
          address: studentData.address,
          majorId: studentData.majorId,
        });

        // Fetch programs for the student's major
        if (studentData.majorId) {
          fetchPrograms(studentData.majorId);
        }
      } catch (error) {
        toast.error("Failed to fetch student information");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentInfo();
  }, [form]);

  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const response = await getMajor();
        setMajors(response);
      } catch (error) {
        toast.error("Failed to fetch majors");
      }
    };

    fetchMajors();
  }, []);

  const fetchPrograms = async (majorId: string) => {
    try {
      const response = await getProgramsByMajor(majorId);
      setPrograms(response);
    } catch (error) {
      toast.error("Failed to fetch programs");
    }
  };

  const onMajorChange = (majorId: string) => {
    fetchPrograms(majorId);
    form.setFieldValue("programId", undefined); // Reset program selection
  };

  const onFinish = async (values: any) => {
    try {
      if (!student?.id) return;

      await updateStudentById(student.id, values);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Student Profile</h1>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Student Code" name="studentCode">
          <Input disabled />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[
            { required: true, message: "Please input your phone number!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: "Please input your address!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Major"
          name="majorId"
          rules={[{ required: true, message: "Please select your major!" }]}
        >
          <Select onChange={onMajorChange}>
            {majors.map((major) => (
              <Select.Option key={major.id} value={major.id}>
                {major.majorName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Program"
          name="programId"
          rules={[{ required: true, message: "Please select a program!" }]}
        >
          <Select>
            {programs.map((program) => (
              <Select.Option key={program.id} value={program.id}>
                {program.programName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Email" name="email">
          <Input disabled />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="bg-blue-500">
            Update Profile
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Profile;
