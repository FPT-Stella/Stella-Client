import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserAlt, FaLock, FaGoogle } from "react-icons/fa";

// Simulated login function
const login = (email: string, password: string) => {
  const users = [
    { email: "admin", password: "123", role: "ADMIN" },
    { email: "user1", password: "123", role: "STUDENT", major: "SE" },
    { email: "user2", password: "123", role: "STUDENT", major: null },
  ];

  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    return {
      userDatas: { roleName: user.role, email: user.email, major: user.major },
    };
  } else {
    throw new Error("Invalid credentials");
  }
};

function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = login(email, password);
      const userDatas = response?.userDatas;

      if (userDatas) {
        // Store user data in localStorage
        localStorage.setItem("userData", JSON.stringify(userDatas));

        // Navigate based on role
        switch (userDatas.roleName) {
          case "STUDENT":
            if (userDatas.major === null) {
              navigate("/profile");
            } else {
              navigate("/manageGPA");
            }
            break;
          case "ADMIN":
            navigate("/dashboard");
            break;
          default:
            navigate("/unknown-role");
            break;
        }
      }
    } catch {
      setError("Sai tên người dùng hoặc mật khẩu!");
    }
  };

  const handleGoogleLogin = () => {
    // Handle Google login here
    console.log("Đăng nhập bằng Google");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://daihoc.fpt.edu.vn/wp-content/uploads/2023/08/nhung-tien-ich-tai-dh-fpt-hcm.jpeg')",
      }}
    >
      {/* Lớp phủ màu cam trong suốt */}
      <div className="absolute inset-0 bg-[rgba(235,98,35,0.88)] opacity-80"></div>

      {/* Nội dung đăng nhập */}
      <div className="relative  p-8 w-1/3 bg-white opacity-90 rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center ">Đăng nhập</h2>

        {error && (
          <div className="mb-4 text-red-500 text-sm text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-white text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaUserAlt className="text-gray-400 ml-2" />
              </span>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 px-6 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder=" Nhập email của bạn"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label
              className="block text-white text-sm font-bold mb-2"
              htmlFor="password"
            >
              Mật khẩu
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaLock className="text-gray-400 ml-2" />
              </span>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder=" Nhập mật khẩu của bạn"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Đăng nhập
          </button>

          <div className="mt-4 text-center">
            <p className="text-sm text-white">__Hoặc đăng nhập__</p>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="mt-2 w-full flex items-center justify-center gap-2 bg-white border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-50"
            >
              <FaGoogle className="text-red-500" />
              <span>Google</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
