import { loginAdmin } from "../../services/Auth";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
function LoginAdmin() {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      // .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .required("Password is required"),
  });
  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      const data = await loginAdmin(values.email, values.password);
      console.log("Đăng nhập thành công:", data);

      const userData = JSON.parse(localStorage.getItem("userData") || "{}");

      toast.success("Login Succsess!", {
        autoClose: 2000,
      });

      setTimeout(() => {
        if (userData.role === "Admin") {
          navigate("/dashboard");
        } else {
          navigate("/profile");
        }
      }, 2000);
    } catch (error) {
      console.error("Đăng nhập thất bại:", error);
      toast.error("Fair loin. Please enter gmail or password again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div>
      <ToastContainer />
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form className="w-full">
            {/* Email Field */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <Field
                type="email"
                name="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B62E6]"
                placeholder="Enter email"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Password Field */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Mật khẩu
              </label>
              <Field
                type="password"
                name="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B62E6]"
                placeholder="Enter Password"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#5B62E6] hover:bg-[#5b62e64f] text-white font-semibold py-2 rounded-lg transition"
            >
              Đăng nhập
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default LoginAdmin;
