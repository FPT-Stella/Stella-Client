import { useEffect, useState } from "react";
import { Form, Input, Select, Button } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getAccountByUsername,
  getStudentByUserId,
  updateStudentById,
} from "../../services/user";
import { getMajor } from "../../services/Major";
import { Student } from "../../models/User";
import { Major } from "../../models/Major";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [student, setStudent] = useState<Student | null>(null);
  const [majors, setMajors] = useState<Major[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isNewStudent, setIsNewStudent] = useState(false);

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

        // Check if this is a new student based on studentCode
        const isNewStudent = !studentData.studentCode;
        setIsNewStudent(isNewStudent);
        localStorage.setItem(
          "profileCompleted",
          isNewStudent ? "false" : "true",
        );

        // Set form values if student exists and has a studentCode
        if (studentData.studentCode) {
          form.setFieldsValue({
            studentCode: studentData.studentCode,
            phone: studentData.phone,
            address: studentData.address,
            majorId: studentData.majorId,
          });
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

  const handleUpdateProfile = async (values: any) => {
    setSubmitting(true);
    try {
      if (!student?.id) {
        toast.error("Student ID not found");
        return;
      }

      await updateStudentById(student.id, values);
      localStorage.setItem("profileCompleted", "true");
      toast.success("Profile updated successfully");

      // Refresh the page to show updated profile
      // window.location.reload();
      setTimeout(() => {
        navigate("/curriculum");
      }, 1500);
    } catch (error) {
      if (error instanceof AxiosError) {
        // Handle API error responses
        if (error.response?.data?.details === "StudentCode already exists") {
          toast.error(
            "Student code is already in use. Please use a different one.",
          );
          // Optionally clear the student code field
          form.setFields([
            {
              name: "studentCode",
              errors: ["This student code is already in use"],
            },
          ]);
        } else if (error.response?.data?.details) {
          // Handle other specific API error messages
          toast.error(error.response.data.details);
        } else {
          // Handle generic API errors
          toast.error("Failed to update profile. Please try again.");
        }
      } else {
        // Handle non-API errors
        toast.error("An unexpected error occurred. Please try again.");
      }
      console.error("Profile update error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <ToastContainer /> {/* Add ToastContainer at the top level */}
      <h1 className="text-2xl font-bold mb-6">
        {isNewStudent ? "Complete Your Profile" : "Update Profile"}
      </h1>
      <Form form={form} layout="vertical" onFinish={handleUpdateProfile}>
        <Form.Item
          label="Student Code"
          name="studentCode"
          rules={[
            { required: true, message: "Please input your student code!" },
            {
              pattern: /^[A-Za-z0-9]+$/,
              message: "Student code can only contain letters and numbers!",
            },
          ]}
        >
          <Input disabled={!isNewStudent} />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[
            { required: true, message: "Please input your phone number!" },
            {
              pattern: /^[0-9]+$/,
              message: "Phone number can only contain numbers!",
            },
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
          <Select>
            {majors.map((major) => (
              <Select.Option key={major.id} value={major.id}>
                {major.majorName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="bg-blue-500"
            loading={submitting}
            disabled={submitting}
          >
            {isNewStudent ? "Complete Profile" : "Update Profile"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Profile;
